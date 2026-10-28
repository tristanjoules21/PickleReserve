<template>
  <section class="other-tab">
    <h2>Photos</h2>

    <div class="photo-grid">
      <div class="photo photo-one"></div>
      <div class="photo photo-two"></div>
      <div class="photo photo-three"></div>
      <div class="photo photo-four"></div>
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
  margin: 0 0 16px;
  font-size: 18px;
  letter-spacing: -0.4px;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.photo {
  min-height: 118px;
  border-radius: 16px;
  border: 1px solid #edf0ef;
  background-size: cover;
  background-position: center;
}

.photo-one {
  background-image: linear-gradient(135deg, rgba(17, 84, 64, 0.25), rgba(17, 84, 64, 0.05)), url('https://hartru.com/cdn/shop/files/180-PICKLEFLEXPRO_main_b0783ac5-c852-42d2-81d9-720c033345c8.png?v=1740162296&width=2048');
}

.photo-two {
  background-image: linear-gradient(135deg, rgba(17, 84, 64, 0.25), rgba(17, 84, 64, 0.05)), url('https://hartru.com/cdn/shop/files/180-PICKLEFLEXPRO_main_b0783ac5-c852-42d2-81d9-720c033345c8.png?v=1740162296&width=2048');
}

.photo-three {
  background-image: linear-gradient(135deg, rgba(17, 84, 64, 0.25), rgba(17, 84, 64, 0.05)), url('https://hartru.com/cdn/shop/files/180-PICKLEFLEXPRO_main_b0783ac5-c852-42d2-81d9-720c033345c8.png?v=1740162296&width=2048');
}

.photo-four {
  background-image: linear-gradient(135deg, rgba(17, 84, 64, 0.25), rgba(17, 84, 64, 0.05)), url('https://hartru.com/cdn/shop/files/180-PICKLEFLEXPRO_main_b0783ac5-c852-42d2-81d9-720c033345c8.png?v=1740162296&width=2048');
}
</style>
