<template>
  <div>
    <TheHeader title="Index">
      <FlexSpacer />
      <ThemeSwitcher />
      <ThemeSwitcher />
      <ThemeSwitcher />
    </TheHeader>
    <h1>Index</h1>
  </div>
</template>

<script>
import TheHeader from 'components/TheHeader.vue'
import FlexSpacer from 'components/FlexSpacer.vue'
import ThemeSwitcher from 'components/ThemeSwitcher.vue'

export default {
  name: 'Index',

  components: { ThemeSwitcher, FlexSpacer, TheHeader },
}
</script>
