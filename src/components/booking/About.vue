<script setup>
const amenities = ['Free Wi-Fi', 'Parking', 'Showers', 'Paddle rental']

defineProps({
  venue: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <section class="other-tab">
    <h2>About PickleReserve</h2>
    <p>{{ venue.description }}</p>

    <h3>Amenities</h3>

    <div class="amenities">
      <div v-for="amenity in amenities" :key="amenity">
        <span>{{ amenity }}</span>
      </div>
    </div>

    <h3>Opening hours</h3>

    <div class="hours">
      <div>
        <span>Monday – Sunday</span>
        <strong>{{ venue.hours }}</strong>
      </div>
    </div>
  </section>
</template>

<style scoped>
.other-tab {
  background: white;
  padding: 18px 16px 60px;
  border-radius: 0 0 22px 22px;
}

.other-tab h2 {
  margin: 0 0 12px;
  font-size: 18px;
  letter-spacing: -0.4px;
}

.other-tab p {
  margin: 0 0 18px;
  color: #596461;
  font-size: 14px;
  line-height: 1.65;
}

.other-tab h3 {
  margin: 18px 0 12px;
  font-size: 14px;
  color: #2d3735;
}

.amenities {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 10px;
}

.amenities div {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #edf0ef;
  border-radius: 12px;
  background: #f9fbfa;
  padding: 12px 10px;
  font-size: 13px;
  color: #3d4b47;
}

.amenities span {
  font-size: 16px;
  color: #18875f;
}

.hours {
  border: 1px solid #edf0ef;
  border-radius: 14px;
  background: #f9fbfa;
  overflow: hidden;
}

.hours div {
  display: flex;
  justify-content: space-between;
  padding: 12px 14px;
  font-size: 13px;
}

.hours span {
  color: #596461;
}

.hours strong {
  color: #101817;
}
</style>
