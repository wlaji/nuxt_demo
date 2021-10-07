<template>
  <v-app>
    <v-system-bar
      height="40"
      app
      dark
      color="primary"
    >
      <span>{{ $t('name') }}</span>
      <v-spacer></v-spacer>
      <v-menu offset-y open-on-hover>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">
            <v-icon>
              mdi-translate
            </v-icon>
            <v-icon>
              mdi-chevron-down
            </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="locale in availableLocales"
            :key="locale.name"
            @click="changeLang(locale)"
          >
            <v-list-item-title>{{ locale.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-system-bar>
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <v-toolbar-title>Collapsing Bar</v-toolbar-title>
      <ul class="d-flex justify-space-between align-center">
        <li class="mx-2">
          <nuxt-link :to="localePath('index')">{{ $t('home') }}</nuxt-link>
        </li>
        <li class="mx-2">
          <nuxt-link :to="localePath('about-us')">{{ $t('about') }}</nuxt-link>
        </li>
      </ul>
    </v-app-bar>
    <v-navigation-drawer absolute temporary v-model="drawer">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            Application
          </v-list-item-title>
          <v-list-item-subtitle>
            subtext
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
        dense
        nav
      >
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <!-- 根据应用组件来调整你的内容 -->
    <v-main>

      <!-- 给应用提供合适的间距 -->
      <v-container fluid>

        <nuxt></nuxt>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

export default {
  head () {
    const i18nHead = this.$nuxtI18nHead({ addSeoAttributes: true })
    return {
      htmlAttrs: {
        ...i18nHead.htmlAttrs
      },
    }
  },
  data() {
    return {
      items: [
        {title: 'Dashboard', icon: 'mdi-view-dashboard'},
        {title: 'Photos', icon: 'mdi-image'},
        {title: 'About', icon: 'mdi-help-box'},
      ],
      right: null,
      drawer: false,
      value: 'recent'
    }
  },
  computed: {
    availableLocales() {
      return this.$i18n.locales.filter(i => i.code)
    }
  },
  methods: {
    changeLang(locale) {
      this.$i18n.setLocale(locale.code)
    }
  },
  mounted() {

  }
}
</script>
