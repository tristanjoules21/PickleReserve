import { expect, test } from '@playwright/test'

async function selectFirstSlot(page: import('@playwright/test').Page) {
  const firstTimeRow = page.getByRole('row', { name: /6AM – 7AM/ })
  await firstTimeRow.getByRole('button').first().click()
}

async function continueToBookingForm(page: import('@playwright/test').Page) {
  await page.goto('/book')
  await selectFirstSlot(page)
  await page.getByRole('button', { name: 'Reserve' }).click()
  await page.getByRole('button', { name: 'Confirm & Pay' }).click()
  await expect(page).toHaveURL(/\/booking-form$/)
}

async function gotoLogin(page: import('@playwright/test').Page) {
  await page.goto('/login')
  await expect(page).toHaveURL(/\/login$/)
}

test.describe('Application Automation Test Suite', () => {
  // ==============================
  // 10 FUNCTIONAL CHECKS
  // ==============================

  test('Functional 1 - Admin login authenticates and opens the dashboard', async ({ page }) => {
    let submittedCredentials: Record<string, unknown> | undefined
    let authorizationHeader: string | undefined
    await page.route('**/api/login', async (route) => {
      submittedCredentials = route.request().postDataJSON()
      await route.fulfill({
        status: 200,
        json: {
          token: 'test-access-token',
          user: { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'ADMIN' }
        }
      })
    })
    await page.route('**/api/dashboard', (route) => {
      authorizationHeader = route.request().headers().authorization
      return route.fulfill({
        json: {
          metrics: {
            today_reservations: 0,
            capacity_percentage: 0,
            active_courts: 0,
            total_courts: 0,
            courts: [],
            monthly_revenue: 0,
            monthly_revenue_change: null,
            peak_hours_start: '17:00:00',
            peak_hours_end: '22:00:00',
            peak_hours_revenue: 0,
            off_peak_revenue: 0,
            revenue_by_day: []
          },
          recent_reservations: []
        }
      })
    })

    await gotoLogin(page)
    await page.getByLabel('Email').fill('admin@example.com')
    await page.getByPlaceholder('••••••••').fill('test-password')
    await page.getByLabel('Remember me').check()

    await page.getByRole('button', { name: 'Log In' }).click()

    await expect(page).toHaveURL(/\/admin$/)
    await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible()
    expect(submittedCredentials).toMatchObject({
      email: 'admin@example.com',
      password: 'test-password',
      remember: true
    })
    expect(await page.evaluate(() => localStorage.getItem('token'))).toBe('test-access-token')
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('user') ?? 'null'))).toMatchObject({
      email: 'admin@example.com',
      role: 'ADMIN'
    })
    expect(authorizationHeader).toBe('Bearer test-access-token')
  })

  test('Customer account is denied access to the admin login', async ({ page }) => {
    await page.route('**/api/login', (route) =>
      route.fulfill({
        status: 403,
        json: { message: 'Only administrator accounts can sign in here.' }
      })
    )

    await gotoLogin(page)
    await page.getByLabel('Email').fill('player@example.com')
    await page.getByPlaceholder('••••••••').fill('customer-password')
    await page.getByRole('button', { name: 'Log In' }).click()

    await expect(page.getByRole('alert')).toHaveText('Only administrator accounts can sign in here.')
    await expect(page).toHaveURL(/\/login$/)
    expect(await page.evaluate(() => localStorage.getItem('token'))).toBeNull()
  })

  test('Admin can log out and revoke their session', async ({ page }) => {
    let logoutAuthorization: string | undefined
    await page.addInitScript(() => {
      localStorage.setItem('token', 'test-access-token')
      localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Admin User', role: 'ADMIN' }))
    })
    await page.route('**/api/dashboard', (route) =>
      route.fulfill({
        json: {
          metrics: {
            today_reservations: 0,
            capacity_percentage: 0,
            active_courts: 0,
            total_courts: 0,
            courts: [],
            monthly_revenue: 0,
            monthly_revenue_change: null,
            peak_hours_start: '17:00:00',
            peak_hours_end: '22:00:00',
            peak_hours_revenue: 0,
            off_peak_revenue: 0,
            revenue_by_day: []
          },
          recent_reservations: []
        }
      })
    )
    await page.route('**/api/logout', (route) => {
      logoutAuthorization = route.request().headers().authorization
      return route.fulfill({ json: { message: 'Logged out successfully' } })
    })

    await page.goto('/admin')
    await page.getByRole('button', { name: 'Logout' }).click()

    await expect(page).toHaveURL(/\/login$/)
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
    expect(logoutAuthorization).toBe('Bearer test-access-token')
    expect(await page.evaluate(() => localStorage.getItem('token'))).toBeNull()
  })

  test('Login displays invalid credential errors without navigating', async ({ page }) => {
    await page.route('**/api/login', (route) =>
      route.fulfill({ status: 401, json: { message: 'Invalid credentials' } })
    )

    await gotoLogin(page)
    await page.getByLabel('Email').fill('player@example.com')
    await page.getByPlaceholder('••••••••').fill('incorrect-password')
    await page.getByRole('button', { name: 'Log In' }).click()

    await expect(page.getByRole('alert')).toHaveText('Invalid credentials')
    await expect(page).toHaveURL(/\/login$/)
    expect(await page.evaluate(() => localStorage.getItem('token'))).toBeNull()
  })

  test('Functional 2 - Login password visibility toggle works', async ({ page }) => {
    await gotoLogin(page)
    const password = page.getByPlaceholder('••••••••')

    await password.fill('test-password')
    await expect(password).toHaveAttribute('type', 'password')
    await page.getByRole('button', { name: 'Show password' }).click()
    await expect(password).toHaveAttribute('type', 'text')
    await page.getByRole('button', { name: 'Hide password' }).click()
    await expect(password).toHaveAttribute('type', 'password')
  })

  test('Functional 3 - Public registration is disabled', async ({ page }) => {
    await page.goto('/register')
    await expect(page.getByRole('heading', { name: 'Registration is disabled.' })).toBeVisible()
    await expect(page.getByText('Administrator accounts are created securely by the system administrator.')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Return to admin login' })).toBeVisible()
    await expect(page.getByRole('textbox')).toHaveCount(0)
    await expect(page).toHaveURL(/\/register$/)
  })

  test('Functional 5 - Booking tab navigation works', async ({ page }) => {
    await page.goto('/book')

    await page.getByRole('button', { name: 'About', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'About PickleReserve' })).toBeVisible()

    await page.getByRole('button', { name: 'Photos', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'Photos' })).toBeVisible()

    await page.getByRole('button', { name: 'Chat', exact: true }).click()
    await expect(page.getByText('Hello! How can we assist you with your reservation?')).toBeVisible()

    await page.getByRole('button', { name: 'Book', exact: true }).click()
    await expect(page.getByRole('columnheader', { name: 'Court 1' })).toBeVisible()
  })

  test('Functional 6 - Selecting a booking slot updates the reservation total', async ({ page }) => {
    await page.goto('/book')

    await selectFirstSlot(page)

    await expect(page.locator('.booking-total')).toContainText('1 slot selected')
    await expect(page.locator('.booking-total')).toContainText('₱350')
    await expect(page.getByRole('button', { name: 'Reserve' })).toBeEnabled()
  })

  test('Functional 7 - Deselecting a booking slot updates the reservation total', async ({ page }) => {
    await page.goto('/book')
    await selectFirstSlot(page)
    await selectFirstSlot(page)

    await expect(page.locator('.booking-total')).toContainText('No slots selected')
    await expect(page.locator('.booking-total')).toContainText('₱0')
    await expect(page.getByRole('button', { name: 'Select a slot' })).toBeDisabled()
  })

  test('Functional 8 - Selecting a date clears the previous slot selection', async ({ page }) => {
    await page.goto('/book')
    await selectFirstSlot(page)
    await expect(page.locator('.booking-total')).toContainText('1 slot selected')
    const initialDate = await page.locator('.date strong').innerText()

    await page.getByRole('button', { name: '›', exact: true }).last().click()

    await expect(page.locator('.date strong')).not.toHaveText(initialDate)
    await expect(page.locator('.booking-total')).toContainText('No slots selected')
    await expect(page.locator('.booking-total')).toContainText('₱0')
  })

  test('Functional 9 - Reserving selected slots navigates to booking form', async ({ page }) => {
    await page.goto('/book')
    await selectFirstSlot(page)
    await page.getByRole('button', { name: 'Reserve' }).click()
    await expect(page.getByRole('heading', { name: 'Confirm reservation' })).toBeVisible()
    await page.getByRole('button', { name: 'Confirm & Pay' }).click()

    await expect(page).toHaveURL(/\/booking-form$/)
    const pendingBooking = await page.evaluate(() =>
      JSON.parse(sessionStorage.getItem('picklereserve.pending-booking') ?? 'null')
    )
    expect(pendingBooking).toMatchObject({
      price: 350,
      total: 350,
      slots: [{ court: 'Court 1', row: 0, time: '6AM – 7AM' }]
    })
  })

  test('Functional 10 - Booking details submission creates a confirmation state', async ({ page }) => {
    let submittedPayload: Record<string, unknown> | undefined
    await page.route('**/api/courts', (route) =>
      route.fulfill({
        json: [{ id: 12, name: 'Court 1', price_per_hour: '350.00', is_active: true }]
      })
    )
    await page.route('**/api/bookings', async (route) => {
      submittedPayload = route.request().postDataJSON()
      await route.fulfill({
        status: 201,
        json: { message: 'Reservation request submitted successfully!', bookings: [{ id: 42 }] }
      })
    })

    await continueToBookingForm(page)
    await page.getByPlaceholder('Name of booking contact').fill('Test Player')
    await page.getByPlaceholder('you@example.com').fill('player@example.com')
    await page.getByPlaceholder('09XX XXX XXXX').fill('09123456789')
    await page.getByRole('radio', { name: /GCash/ }).check()
    await page.getByPlaceholder('Anything the venue should know?').fill('Arriving early')
    await page.getByRole('button', { name: /Submit reservation request/ }).click()

    await expect(page.getByText('Reservation request sent')).toBeVisible()
    await expect(page.getByRole('heading', { name: "You're almost on the court." })).toBeVisible()
    await expect(page.getByText(/PR-\d{7}/)).toBeVisible()

    const storedConfirmation = await page.evaluate(() =>
      JSON.parse(sessionStorage.getItem('picklereserve.pending-booking.confirmation') ?? 'null')
    )
    expect(storedConfirmation).toMatchObject({
      total: 350,
      status: 'Pending',
      bookingIds: [42],
      customer: {
        fullName: 'Test Player',
        email: 'player@example.com',
        phone: '09123456789',
        paymentMethod: 'GCash',
        notes: 'Arriving early'
      }
    })
    expect(await page.evaluate(() => sessionStorage.getItem('picklereserve.pending-booking'))).toBeNull()
    expect(submittedPayload).toMatchObject({
      customer_name: 'Test Player',
      customer_email: 'player@example.com',
      customer_phone: '09123456789',
      payment_method: 'GCash',
      notes: 'Arriving early',
      bookings: [{ court_id: 12, start_time: /^\d{4}-\d{2}-\d{2} 06:00:00$/, end_time: /^\d{4}-\d{2}-\d{2} 07:00:00$/ }]
    })
  })

  test('Booking form reports API failures without displaying a saved confirmation', async ({ page }) => {
    await page.route('**/api/courts', (route) =>
      route.fulfill({
        json: [{ id: 12, name: 'Court 1', price_per_hour: '350.00', is_active: true }]
      })
    )
    await page.route('**/api/bookings', (route) =>
      route.fulfill({
        status: 422,
        json: { message: 'The given data was invalid.', errors: { customer_email: ['Email is invalid.'] } }
      })
    )

    await continueToBookingForm(page)
    await page.getByPlaceholder('Name of booking contact').fill('Test Player')
    await page.getByPlaceholder('you@example.com').fill('player@example.com')
    await page.getByPlaceholder('09XX XXX XXXX').fill('09123456789')
    await page.getByRole('button', { name: /Submit reservation request/ }).click()

    await expect(page.getByRole('alert')).toHaveText('Email is invalid.')
    await expect(page.getByText('Reservation request sent')).toHaveCount(0)
    expect(await page.evaluate(() => sessionStorage.getItem('picklereserve.pending-booking'))).not.toBeNull()
  })

  // ==============================
  // 10 UI VALIDATION CHECKS
  // ==============================

  test('UI 1 - Login page renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 })
    await gotoLogin(page)

    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
    await expect(page.getByText('Sign in to pick up where you left off.')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Make room for one more game.' })).toBeVisible()
    await expect(page.getByText('Administrator access only. Contact your system administrator for an account.')).toBeVisible()
  })

  test('UI 2 - Registration page renders correctly', async ({ page }) => {
    await page.goto('/register')

    await expect(page.getByRole('heading', { name: 'Registration is disabled.' })).toBeVisible()
    await expect(page.getByText('Administrator accounts are created securely by the system administrator.')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Return to admin login' })).toBeVisible()
    await expect(page.getByRole('textbox')).toHaveCount(0)
  })

  test('UI 3 - Login form controls are visible', async ({ page }) => {
    await gotoLogin(page)

    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Email')).toHaveAttribute('required', '')
    await expect(page.getByPlaceholder('••••••••')).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Password' })).toHaveAttribute('required', '')
    await expect(page.getByLabel('Remember me')).toBeVisible()
    await expect(page.getByLabel('Remember me')).not.toBeChecked()
    await expect(page.getByRole('button', { name: 'Log In' })).toBeEnabled()
  })

  test('UI - Login requires an email and password before submitting', async ({ page }) => {
    let loginRequestSent = false
    await page.route('**/api/login', (route) => {
      loginRequestSent = true
      return route.fulfill({ status: 401, json: { message: 'Invalid credentials' } })
    })

    await gotoLogin(page)
    await page.getByRole('button', { name: 'Log In' }).click()

    await expect(page).toHaveURL(/\/login$/)
    expect(loginRequestSent).toBe(false)
  })

  test('UI 4 - Admin pages redirect unauthenticated visitors to login', async ({ page }) => {
    await page.goto('/admin')

    await expect(page).toHaveURL(/\/login\?redirect=\/admin$/)
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()

    await page.goto('/settings')
    await expect(page).toHaveURL(/\/login\?redirect=\/settings$/)
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
  })

  test('UI 5 - Booking page displays the court and booking interface', async ({ page }) => {
    await page.goto('/book')

    await expect(page.getByRole('heading', { name: 'PickleReserve' })).toBeVisible()
    await expect(page.getByText('Cagayan de Oro City')).toBeVisible()
    await expect(page.getByText('₱350', { exact: false }).first()).toBeVisible()
    await expect(page.getByRole('button', { name: 'Select a slot' })).toBeDisabled()
    await expect(page.locator('.booking-bar')).toBeVisible()
  })

  test('UI 6 - Booking tabs are visible and usable', async ({ page }) => {
    await page.goto('/book')

    for (const tabName of ['Book', 'About', 'Photos', 'Chat']) {
      await expect(page.getByRole('button', { name: tabName, exact: true })).toBeVisible()
      await expect(page.getByRole('button', { name: tabName, exact: true })).toBeEnabled()
    }

    await page.getByRole('button', { name: 'About', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'About PickleReserve' })).toBeVisible()
  })

  test('UI 7 - Booking schedule and slot controls are visible', async ({ page }) => {
    await page.goto('/book')

    await expect(page.getByRole('columnheader', { name: 'Time' })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: 'Court 1' })).toBeVisible()
    await expect(page.getByRole('row', { name: /6AM – 7AM/ })).toBeVisible()
    await expect(page.getByRole('row', { name: /6AM – 7AM/ }).getByRole('button').first()).toBeEnabled()
    await expect(page.getByRole('button', { name: 'Select date' })).toBeVisible()
  })

  test('UI 8 - Reservation confirmation sheet displays correctly', async ({ page }) => {
    await page.goto('/book')
    await selectFirstSlot(page)
    await page.getByRole('button', { name: 'Reserve' }).click()

    await expect(page.getByRole('heading', { name: 'Confirm reservation' })).toBeVisible()
    await expect(page.getByText('Court 1 · 6AM – 7AM')).toBeVisible()
    await expect(page.locator('.sheet-total')).toContainText('₱350')
    await expect(page.getByRole('button', { name: 'Confirm & Pay' })).toBeEnabled()
  })

  test('UI 9 - Booking form displays correctly', async ({ page }) => {
    await continueToBookingForm(page)

    await expect(page.getByRole('heading', { name: 'Complete your booking' })).toBeVisible()
    await expect(page.getByPlaceholder('Name of booking contact')).toBeVisible()
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible()
    await expect(page.getByPlaceholder('09XX XXX XXXX')).toBeVisible()
    await expect(page.getByRole('radio', { name: /Pay at the venue/ })).toBeChecked()
    await expect(page.getByRole('radio', { name: /GCash/ })).toBeVisible()
    await expect(page.getByPlaceholder('Anything the venue should know?')).toBeVisible()
    await expect(page.getByRole('complementary', { name: 'Booking summary' })).toContainText('₱350')
  })

  test('UI 10 - Admin layout and sidebar respond correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.addInitScript(() => {
      sessionStorage.setItem('token', 'test-admin-token')
      sessionStorage.setItem('user', JSON.stringify({ id: 1, name: 'Admin User', role: 'ADMIN' }))
    })
    await page.route('**/api/dashboard', (route) =>
      route.fulfill({
        json: {
          metrics: {
            today_reservations: 0,
            capacity_percentage: 0,
            active_courts: 0,
            total_courts: 0,
            courts: [],
            monthly_revenue: 0,
            monthly_revenue_change: null,
            peak_hours_start: '17:00:00',
            peak_hours_end: '22:00:00',
            peak_hours_revenue: 0,
            off_peak_revenue: 0,
            revenue_by_day: []
          },
          recent_reservations: []
        }
      })
    )
    await page.goto('/admin')

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
    await expect(page.locator('.mobile-menu')).toBeVisible()
    const sidebar = page.locator('.sidebar')
    await expect(sidebar).not.toHaveClass(/sidebar-open/)

    await page.locator('.mobile-menu').click()
    await expect(sidebar).toHaveClass(/sidebar-open/)
    await expect(page.locator('.sidebar-overlay')).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Courts' })).toBeVisible()

    await sidebar.locator('.mobile-close').click()
    await expect(sidebar).not.toHaveClass(/sidebar-open/)
    await expect(page.locator('.sidebar-overlay')).toHaveCount(0)
  })

  test('UI 11 - Admin settings manage message preview preferences', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('token', 'test-admin-token')
      sessionStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'ADMIN'
      }))
      sessionStorage.setItem('picklereserve.admin-chat-preview', JSON.stringify([
        { id: 'preview-1', text: 'Preview message', time: '10:00 AM' }
      ]))
    })

    await page.goto('/settings')

    await expect(page.getByRole('heading', { name: 'Admin settings' })).toBeVisible()
    await expect(page.getByText('admin@example.com')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Open customer messages' })).toBeVisible()
    await expect(page.locator('.sidebar')).toHaveCSS('position', 'fixed')
    await expect(page.locator('.navigation')).toHaveCSS('display', 'flex')
    await expect(page.locator('.navigation')).toHaveCSS('flex-direction', 'column')
    await expect(page.getByRole('link', { name: 'Settings' })).toHaveClass(/active/)
    await expect(page.locator('.mobile-menu')).toBeHidden()

    await page.getByRole('checkbox', { name: 'Show Messages shortcut' }).uncheck()
    await expect(page.getByRole('status')).toHaveText('Message shortcut preference saved on this browser.')
    await expect(page.getByRole('button', { name: 'Open customer messages' })).toHaveCount(0)

    await page.getByRole('button', { name: 'Clear local preview history' }).click()
    await expect(page.getByRole('status')).toHaveText('Local message preview history cleared.')
    expect(await page.evaluate(() => sessionStorage.getItem('picklereserve.admin-chat-preview'))).toBeNull()

    await page.setViewportSize({ width: 390, height: 844 })
    await expect(page.locator('.mobile-menu')).toBeVisible()
    await page.locator('.mobile-menu').click()
    await expect(page.locator('.sidebar')).toHaveClass(/sidebar-open/)
    await expect(page.locator('.sidebar-overlay')).toBeVisible()
  })

  test('Admin notifications show pending booking requests and open reservations', async ({ page }) => {
    let reservationCreated = false
    await page.addInitScript(() => {
      sessionStorage.setItem('token', 'test-admin-token')
      sessionStorage.setItem('user', JSON.stringify({ id: 1, name: 'Admin User', role: 'ADMIN' }))
    })
    await page.route('**/api/admin/notifications', (route) =>
      route.fulfill({
        json: reservationCreated ? [{
          id: 42,
          customer_name: 'New Player',
          created_at: '2026-10-28T04:00:00.000Z',
          court: { id: 1, name: 'Court 1' }
        }] : []
      })
    )
    await page.route('**/api/bookings', (route) => route.fulfill({ json: [] }))
    await page.route('**/api/dashboard', (route) =>
      route.fulfill({
        json: {
          metrics: {
            today_reservations: 0,
            capacity_percentage: 0,
            active_courts: 0,
            total_courts: 0,
            courts: [],
            monthly_revenue: 0,
            monthly_revenue_change: null,
            peak_hours_start: '17:00:00',
            peak_hours_end: '22:00:00',
            peak_hours_revenue: 0,
            off_peak_revenue: 0,
            revenue_by_day: []
          },
          recent_reservations: []
        }
      })
    )

    await page.goto('/admin')
    const notificationButton = page.getByRole('button', { name: 'Notifications, 0 unread reservations' })
    await expect(notificationButton).toBeVisible()
    await notificationButton.click()
    await expect(page.getByRole('region', { name: 'Booking notifications' })).toContainText("You're all caught up")
    reservationCreated = true
    await page.getByRole('button', { name: 'Refresh notifications' }).click()
    await expect(page.getByRole('button', { name: 'Notifications, 1 unread reservations' })).toBeVisible()
    await expect(page.getByRole('region', { name: 'Booking notifications' })).toContainText('New Player · Court 1')
    await page.getByRole('button', { name: /New booking request/ }).click()
    await expect(page).toHaveURL(/\/reservations$/)
  })

  test('Reservation status updates immediately without refetching all bookings', async ({ page }) => {
    let bookingListRequests = 0
    await page.addInitScript(() => {
      sessionStorage.setItem('token', 'test-admin-token')
      sessionStorage.setItem('user', JSON.stringify({ id: 1, name: 'Admin User', role: 'ADMIN' }))
    })
    await page.route('**/api/admin/notifications', (route) => route.fulfill({ json: [] }))
    await page.route('**/api/bookings', (route) => {
      bookingListRequests += 1
      return route.fulfill({
        json: [{
          id: 7,
          customer_name: 'Pending Player',
          customer_email: 'player@example.com',
          customer_phone: '09123456789',
          court_id: 1,
          court: { id: 1, name: 'Court 1' },
          start_time: '2026-10-28T06:00:00',
          end_time: '2026-10-28T07:00:00',
          total_price: 350,
          payment_method: 'GCash',
          status: 'Pending'
        }]
      })
    })
    await page.route('**/api/bookings/7/status', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 400))
      return route.fulfill({
        json: {
          id: 7,
          customer_name: 'Pending Player',
          court_id: 1,
          court: { id: 1, name: 'Court 1' },
          status: 'Approved'
        }
      })
    })

    await page.goto('/reservations')
    const row = page.getByRole('row', { name: /Pending Player/ })
    await expect(row.getByText('Pending', { exact: true })).toBeVisible()
    await row.getByTitle('Approve').click()
    await expect(row.getByText('Approved', { exact: true })).toBeVisible()
    expect(bookingListRequests).toBe(1)
  })

  test('Admin dashboard data is reused when returning before the cache expires', async ({ page }) => {
    let dashboardRequests = 0
    await page.addInitScript(() => {
      sessionStorage.setItem('token', 'test-admin-token')
      sessionStorage.setItem('user', JSON.stringify({ id: 1, name: 'Admin User', role: 'ADMIN' }))
    })
    await page.route('**/api/admin/notifications', (route) => route.fulfill({ json: [] }))
    await page.route('**/api/dashboard', (route) => {
      dashboardRequests += 1
      return route.fulfill({
        json: {
          metrics: {
            today_reservations: 0,
            capacity_percentage: 0,
            active_courts: 0,
            total_courts: 0,
            courts: [],
            monthly_revenue: 0,
            monthly_revenue_change: null,
            peak_hours_start: '17:00:00',
            peak_hours_end: '22:00:00',
            peak_hours_revenue: 0,
            off_peak_revenue: 0,
            revenue_by_day: []
          },
          recent_reservations: []
        }
      })
    })

    await page.goto('/admin')
    await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible()
    await page.getByRole('link', { name: 'Settings' }).click()
    await expect(page.getByRole('heading', { name: 'Admin settings' })).toBeVisible()
    await page.getByRole('link', { name: 'Dashboard' }).click()
    await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible()

    expect(dashboardRequests).toBe(1)
  })
})