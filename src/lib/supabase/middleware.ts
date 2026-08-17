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
  const demoUserCookie = request.cookies.get('sedes_demo_user')?.value

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

  // Si ya está autenticado e intenta ir al login, redirigir a su portal
  if (userRole && isAuthRoute) {
    if (userRole === 'direccion' || userRole === 'secretaria') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    } else if (userRole === 'docente') {
      return NextResponse.redirect(new URL('/docente/secciones', request.url))
    } else if (userRole === 'padre') {
      return NextResponse.redirect(new URL('/padre/dashboard', request.url))
    }
  }

  // Protección de rutas por Rol
  if (pathname.startsWith('/admin') && userRole !== 'direccion' && userRole !== 'secretaria') {
    return NextResponse.redirect(new URL('/login?error=unauthorized_admin', request.url))
  }

  if (pathname.startsWith('/docente') && userRole !== 'docente' && userRole !== 'direccion') {
    return NextResponse.redirect(new URL('/login?error=unauthorized_docente', request.url))
  }

  if (pathname.startsWith('/padre') && userRole !== 'padre' && userRole !== 'direccion') {
    return NextResponse.redirect(new URL('/login?error=unauthorized_padre', request.url))
  }

  return response
}
