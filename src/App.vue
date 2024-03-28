<script setup lang="ts">
// import HelloWorld from './components/HelloWorld.vue'
// import VCalendar from "v-calendar";
import { Toaster } from "vue-sonner";
import FormComponent from "./components/FormComponent.vue";
import ContentComponent from "./components/ContentComponent.vue";
</script>

<template>
  <div class="container">
    <h1>CALENDARIO DE TAREAS EN TIEMPO REAL</h1>
    <div class="container__wrapper">
      <div class="container_form">
        <FormComponent />
      </div>
      <div class="container__content">
        <ContentComponent />
      </div>
    </div>
  </div>
  <Toaster richColors />
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  height: 100vh;
}
.container__wrapper {
  width: 100%;
  min-height: 70vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  /* border: 1px solid #000; */
  @media (max-width: 900px) {
    flex-direction: column;
  }
}
.container_form {
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* border: blue 1px solid; */
  @media (max-width: 900px) {
    width: 100%;
  }
}
.container__content {
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* border: red 1px solid; */
  /* border: 1px solid blue; */
  /* padding: 0 10px; */
  @media (max-width: 900px) {
    width: 100%;
  }
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
