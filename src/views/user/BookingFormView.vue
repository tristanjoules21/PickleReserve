<script setup>
import { computed, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'

const STORAGE_KEY = 'picklereserve.pending-booking'

function readBooking() {
	try {
		const booking = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null')
		return booking && Array.isArray(booking.slots) ? booking : null
	} catch {
		return null
	}
}

const booking = readBooking()
const submitted = ref(false)
const confirmationCode = ref('')
const form = reactive({
	fullName: '',
	email: '',
	phone: '',
	paymentMethod: 'Pay at venue',
	notes: ''
})

const formattedDate = computed(() => {
	if (!booking?.date) return ''
	return new Intl.DateTimeFormat('en-PH', {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	}).format(new Date(`${booking.date}T00:00:00`))
})

function submitBooking() {
	if (!booking || !booking.slots.length) return

	confirmationCode.value = `PR-${Date.now().toString().slice(-7)}`
	sessionStorage.setItem(`${STORAGE_KEY}.confirmation`, JSON.stringify({
		...booking,
		customer: { ...form },
		confirmationCode: confirmationCode.value,
		status: 'Pending payment'
	}))
	sessionStorage.removeItem(STORAGE_KEY)
	submitted.value = true
}
</script>

<template>
	<main class="form-page">
		<header class="topbar">
			<RouterLink class="brand" to="/book" aria-label="Back to PickleReserve booking">
				<span class="brand-mark">P</span>
				<span>Pickle<span class="brand-accent">Reserve</span></span>
			</RouterLink>
			<span class="step-label">{{ submitted ? 'Request received' : 'Booking details' }}</span>
		</header>

		<section v-if="submitted" class="success-state" aria-live="polite">
			<div class="success-mark">✓</div>
			<p class="eyebrow">Reservation request sent</p>
			<h1>You're almost on the court.</h1>
			<p class="success-copy">Your request is saved as <strong>{{ confirmationCode }}</strong>. Payment is not processed online yet; please pay at the venue to confirm your reservation.</p>
			<RouterLink class="primary-button" to="/book">Back to booking</RouterLink>
		</section>

		<section v-else-if="!booking || !booking.slots.length" class="empty-state">
			<p class="eyebrow">No selected schedule</p>
			<h1>Choose a court and time first.</h1>
			<p>Your selected schedule will appear here when you continue from the booking page.</p>
			<RouterLink class="primary-button" to="/book">Choose a schedule</RouterLink>
		</section>

		<div v-else class="content-grid">
			<section class="form-column">
				<div class="page-heading">
					<p class="eyebrow">One last step</p>
					<h1>Complete your booking</h1>
					<p>Enter the contact details for the person responsible for this reservation.</p>
				</div>

				<form class="booking-form" @submit.prevent="submitBooking">
					<fieldset>
						<legend>Contact details</legend>
						<div class="field-grid">
							<label class="field full-width">
								<span>Full name</span>
								<input v-model.trim="form.fullName" name="fullName" autocomplete="name" required placeholder="Name of booking contact" />
							</label>
							<label class="field">
								<span>Email address</span>
								<input v-model.trim="form.email" name="email" type="email" autocomplete="email" required placeholder="you@example.com" />
							</label>
							<label class="field">
								<span>Mobile number</span>
								<input v-model.trim="form.phone" name="phone" type="tel" autocomplete="tel" required placeholder="09XX XXX XXXX" />
							</label>
						</div>
					</fieldset>

					<fieldset>
						<legend>Payment preference</legend>
						<div class="payment-options">
							<label class="payment-option" :class="{ selected: form.paymentMethod === 'Pay at venue' }">
								<input v-model="form.paymentMethod" type="radio" name="paymentMethod" value="Pay at venue" />
								<span class="payment-icon">₱</span>
								<span><strong>Pay at the venue</strong><small>Pay when you arrive for your session.</small></span>
							</label>
							<label class="payment-option" :class="{ selected: form.paymentMethod === 'GCash' }">
								<input v-model="form.paymentMethod" type="radio" name="paymentMethod" value="GCash" />
								<span class="payment-icon gcash">G</span>
								<span><strong>GCash</strong><small>Payment instructions will be confirmed by the venue.</small></span>
							</label>
						</div>
					</fieldset>

					<label class="field">
						<span>Additional notes <small>Optional</small></span>
						<textarea v-model.trim="form.notes" name="notes" rows="3" maxlength="300" placeholder="Anything the venue should know?" />
					</label>

					<p class="form-note">Submitting sends a reservation request. Online payment is not connected yet, so your time is confirmed after the venue verifies payment.</p>
					<button class="primary-button submit-button" type="submit">Submit reservation request <span aria-hidden="true">→</span></button>
				</form>
			</section>

			<aside class="summary-panel" aria-label="Booking summary">
				<p class="eyebrow">Your reservation</p>
				<h2>PickleReserve</h2>
				<p class="location">Cagayan de Oro City</p>
				<div class="summary-date"><span class="summary-icon">▦</span><strong>{{ formattedDate }}</strong></div>
				<div class="slot-list">
					<div v-for="(slot, index) in booking.slots" :key="`${slot.court}-${slot.row}-${index}`" class="slot-item">
						<span><strong>{{ slot.court }}</strong><small>{{ slot.time }}</small></span>
						<strong>₱{{ booking.price }}</strong>
					</div>
				</div>
				<div class="total-row"><span>{{ booking.slots.length }} {{ booking.slots.length === 1 ? 'hour' : 'hours' }}</span><strong>₱{{ booking.total }}</strong></div>
				<p class="rate-note">₱{{ booking.price }} per court-hour</p>
			</aside>
		</div>
	</main>
</template>

<style scoped>
:global(body) { margin: 0; background: #f4f7f5; color: #17231e; font-family: Inter, 'Segoe UI', sans-serif; }
* { box-sizing: border-box; }
.form-page { width: min(100%, 520px); min-height: 100vh; margin: 0 auto; }
.topbar { height: 68px; padding: 0 max(24px, calc((100vw - 1120px) / 2)); background: #fff; border-bottom: 1px solid #e3eae6; display: flex; align-items: center; justify-content: space-between; }
.brand { display: inline-flex; align-items: center; gap: 10px; color: #18382b; font-size: 17px; font-weight: 750; text-decoration: none; }
.brand-mark { width: 32px; height: 32px; display: grid; place-items: center; border-radius: 8px; background: #087c52; color: white; }
.brand-accent { color: #087c52; }
.step-label { color: #67766e; font-size: 13px; }
.content-grid { width: 100%; margin: 0; padding: 24px 14px 36px; display: flex; flex-direction: column; gap: 24px; align-items: stretch; }
.page-heading { margin-bottom: 30px; }
.eyebrow { margin: 0 0 9px; color: #087c52; font-size: 11px; font-weight: 750; letter-spacing: 1.1px; text-transform: uppercase; }
h1 { margin: 0; font-size: 32px; line-height: 1.15; }
.page-heading > p:last-child { margin: 10px 0 0; color: #68766f; font-size: 14px; line-height: 1.6; }
.booking-form { display: grid; gap: 25px; }
fieldset { margin: 0; padding: 0 0 24px; border: 0; border-bottom: 1px solid #dfe7e2; }
legend { margin-bottom: 17px; padding: 0; font-size: 16px; font-weight: 700; }
.field-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
.field { min-width: 0; display: flex; flex-direction: column; gap: 8px; color: #34443b; font-size: 13px; font-weight: 650; }
.field > span small { margin-left: 5px; color: #89958e; font-size: 11px; font-weight: 450; }
.full-width { grid-column: auto; }
input:not([type='radio']), select, textarea { width: 100%; min-height: 46px; padding: 11px 12px; border: 1px solid #d5dfd9; border-radius: 6px; outline: none; background: #fff; color: #1c2b23; font: inherit; font-size: 14px; }
textarea { resize: vertical; }
input:focus, select:focus, textarea:focus { border-color: #16895e; box-shadow: 0 0 0 3px rgb(22 137 94 / 12%); }
.payment-options { display: grid; gap: 10px; }
.payment-option { min-height: 70px; padding: 13px; border: 1px solid #d8e1dc; border-radius: 7px; display: flex; align-items: center; gap: 12px; cursor: pointer; }
.payment-option.selected { border-color: #16895e; background: #f4fbf7; }
.payment-option input { accent-color: #16895e; }
.payment-icon { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 6px; background: #e8f5ed; color: #087c52; font-weight: 800; }
.payment-icon.gcash { background: #e8f2ff; color: #1769aa; }
.payment-option strong, .payment-option small { display: block; }
.payment-option strong { font-size: 13px; }
.payment-option small { margin-top: 4px; color: #748078; font-size: 11px; font-weight: 400; line-height: 1.4; }
.form-note { margin: -10px 0 0; color: #728078; font-size: 12px; line-height: 1.55; }
.primary-button { min-height: 48px; padding: 0 18px; border: 0; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; gap: 12px; background: #087c52; color: #fff; font: inherit; font-size: 14px; font-weight: 700; text-decoration: none; cursor: pointer; }
.primary-button:hover { background: #066a46; }
.submit-button { width: 100%; }
.summary-panel { order: -1; padding: 18px; border: 1px solid #dfe7e2; border-radius: 8px; background: #fff; }
.summary-panel h2 { margin: 0; font-size: 19px; }
.location { margin: 5px 0 20px; color: #748078; font-size: 12px; }
.summary-date { padding: 14px 0; border-top: 1px solid #e6ece8; border-bottom: 1px solid #e6ece8; display: flex; align-items: center; gap: 10px; font-size: 13px; }
.summary-icon { color: #087c52; }
.slot-list { padding: 8px 0; }
.slot-item { padding: 9px 0; display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 12px; }
.slot-item small { margin-top: 4px; display: block; color: #748078; }
.total-row { padding-top: 14px; border-top: 1px solid #e6ece8; display: flex; align-items: center; justify-content: space-between; font-size: 14px; }
.total-row strong { font-size: 20px; }
.rate-note { margin: 8px 0 0; color: #829087; font-size: 11px; }
.empty-state, .success-state { width: min(580px, calc(100% - 40px)); margin: 100px auto; text-align: center; }
.empty-state > p:not(.eyebrow), .success-copy { color: #68766f; font-size: 14px; line-height: 1.7; }
.empty-state .primary-button, .success-state .primary-button { margin-top: 18px; }
.success-mark { width: 54px; height: 54px; margin: 0 auto 20px; border-radius: 50%; display: grid; place-items: center; background: #e4f5eb; color: #087c52; font-size: 24px; font-weight: 800; }
.success-state .eyebrow { margin-bottom: 10px; }
.success-copy { max-width: 450px; margin: 14px auto 0; }
@media (max-width: 480px) { .content-grid { padding: 20px 14px 32px; } h1 { font-size: 27px; } .topbar { padding: 0 16px; } }
</style>
