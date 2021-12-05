<template>
  <div>
    <TheHeader title="About">
      <FlexSpacer />
      <ThemeSwitcher />
    </TheHeader>
    <h1>About</h1>
  </div>
</template>

<script>
import TheHeader from 'components/TheHeader.vue'
import FlexSpacer from 'components/FlexSpacer.vue'
import ThemeSwitcher from 'components/ThemeSwitcher.vue'

export default {
  name: 'About',

  components: { ThemeSwitcher, FlexSpacer, TheHeader },
}
</script>
