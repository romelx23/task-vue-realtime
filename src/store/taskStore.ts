import { defineStore } from "pinia";
import { Task } from "../components/ContentComponent.vue";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useSocket } from "../composables/useSocket";
import { toast } from "vue-sonner";
import { urlServer } from "../constants/constants";

export const taskStore = defineStore("task", () => {
  const tasks = ref<Task[]>([]);
  const total = ref(0);
  const { connect, disconnect, on, emit } = useSocket();

  // const setTasks = (tasks: Task[], total: number) => {
  //   console.log({ tasks, total });
  //   tasks = tasks;
  //   total = total;
  // };

  onMounted(() => {
    connect(urlServer); // Reemplaza con la URL de tu servidor
    on("get-tasks", (data) => {
      console.log({ data });
      tasks.value = data.tasks;
      total.value = data.total;
      toast.success("han cambiado las tareas");
    });
    emit("get-tasks", {});
  });

  onBeforeUnmount(() => {
    disconnect();
  });

  return {
    tasks,
    total,
  };
});
