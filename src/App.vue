<script setup>
TweenMax.to('.logo', 0.5, { rotation: '360' })
</script>

<template>
  <div class="p-2 bg-gray-400 grid grid-cols-2">
    <img class="logo" alt="PZ logo" src="./assets/PzLogo.png" />
    <div class="vbox">
      <i class="text-3xl">Test Almost</i>
      <PZHello />
    </div>
  </div>

  <div class="p-6 text-2xl text-gray-700 vbox gap-2 overflow-y-scroll">
    <h1 class="text-3xl text-red-900 nowrap">The Night Of The Living Dead</h1>
    <p> It was a quiet night, and Donnie wanted to have a nice calm walk down the road, near the cemetery. </p>

    <p> Then the zombies started to wake up from their graves! So Donnie had to run, run fast, run for the hills! </p>

    <p>
      He runs for the nearest building, it was a
      <i class="text-yellow-200 bg-green-600 px-3 py-2 inline-block rounded-md">
        <i class="fab fa-canadian-maple-leaf"></i>
        Kent Building Supplies</i
      >
      store, but little did he know - it was full of ZOMBIES TOO!
    </p>

    <p>
      He rushed out to avoid the big hoard of zombies inside the store, only to trip down on a grave and get surrounded
      by all the zombies.
    </p>

    <h2>THE END</h2>
  </div>
</template>

<style scoped>
p {
  @apply py-3 leading-10;
}
</style>
