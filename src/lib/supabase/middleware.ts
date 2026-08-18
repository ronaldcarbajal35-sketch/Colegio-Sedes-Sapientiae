import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sedes-sapientiae.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock_anon_key'

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value,
          ...options,
        })
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        })
        response.cookies.set({
          name,
          value,
          ...options,
        })
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value: '',
          ...options,
        })
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        })
        response.cookies.set({
          name,
          value: '',
          ...options,
        })
      },
    },
  })

  // Obtener sesión activa o cookie de rol para demo
  const { data: { user } } = await supabase.auth.getUser()
  const demoRoleCookie = request.cookies.get('sedes_demo_role')?.value

  const pathname = request.nextUrl.pathname

  // Determinar rol activo
  let userRole: string | null = null

  if (user) {
    userRole = user.user_metadata?.rol || 'padre'
  } else if (demoRoleCookie) {
    userRole = demoRoleCookie
  }

  // Rutas públicas que no requieren autenticación
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/recuperar')
  const isPublicAsset = pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.') || pathname === '/'

  if (isPublicAsset) {
    return response
  }

  // Si no está autenticado y trata de ingresar a rutas protegidas
  if (!userRole && !isAuthRoute) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Si ya está autenticado e intenta ir al login, redirigir a su portal correspondiente
  if (userRole && isAuthRoute) {
    const roleRoutes: Record<string, string> = {
      director: '/director/dashboard',
      administrativo: '/admin/dashboard',
      secretaria: '/admin/dashboard',
      docente: '/docente/secciones',
      auxiliar: '/auxiliar/asistencia',
      psicologo: '/psicologia/atenciones',
      padre: '/padre/dashboard',
      alumno: '/alumno/dashboard',
    }
    const target = roleRoutes[userRole] || '/padre/dashboard'
    return NextResponse.redirect(new URL(target, request.url))
  }

  // Protección de rutas por Rol
  if (pathname.startsWith('/director') && userRole !== 'director') {
    return NextResponse.redirect(new URL('/login?error=unauthorized_director', request.url))
  }

  if (pathname.startsWith('/admin') && userRole !== 'administrativo' && userRole !== 'director' && userRole !== 'secretaria') {
    return NextResponse.redirect(new URL('/login?error=unauthorized_admin', request.url))
  }

  if (pathname.startsWith('/docente') && userRole !== 'docente' && userRole !== 'director') {
    return NextResponse.redirect(new URL('/login?error=unauthorized_docente', request.url))
  }

  if (pathname.startsWith('/auxiliar') && userRole !== 'auxiliar' && userRole !== 'director') {
    return NextResponse.redirect(new URL('/login?error=unauthorized_auxiliar', request.url))
  }

  if (pathname.startsWith('/psicologia') && userRole !== 'psicologo' && userRole !== 'director') {
    return NextResponse.redirect(new URL('/login?error=unauthorized_psicologia', request.url))
  }

  if (pathname.startsWith('/padre') && userRole !== 'padre' && userRole !== 'director') {
    return NextResponse.redirect(new URL('/login?error=unauthorized_padre', request.url))
  }

  if (pathname.startsWith('/alumno') && userRole !== 'alumno' && userRole !== 'director') {
    return NextResponse.redirect(new URL('/login?error=unauthorized_alumno', request.url))
  }

  return response
}
