import { defineStore } from "pinia";
import { Task } from "../components/ContentComponent.vue";
import { ref } from "vue";

export const formStore = defineStore("form", () => {
  const selectedItem = ref<Task | null>({
    uid: 0,
    title: "",
    description: "",
    date: new Date().toISOString().substr(0, 10),
    color: "blue",
  });

  const setSelectedItem = (item: Task) => {
    selectedItem.value = item;
  };

  return {
    selectedItem,
    setSelectedItem,
  };
});
