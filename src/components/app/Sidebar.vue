<template>
  <ul class="sidenav app-sidenav" :class="{ open: value }">
    <router-link
      v-for="link in links"
      :key="link.url"
      tag="li"
      active-class="active"
      :to="link.url"
      :exact="link.exact"
    >
      <a href="#" class="waves-effect waves-orange pointer">{{ link.title }}</a>
    </router-link>
  </ul>
</template>

<script>
import localizeFilter from "@/filters/localize.filter";
export default {
  data: () => ({
    links: [
      { title: localizeFilter("MenuBill"), url: "/", exact: true },
      { title: localizeFilter("MenuHistory"), url: "/history" },
      { title: localizeFilter("MenuPlanning"), url: "/planning" },
      { title: localizeFilter("MenuAddNewRecord"), url: "/record" },
      { title: localizeFilter("MenuCategories"), url: "/categories" }
    ]
  }),
  props: ["value"]
};
</script>
