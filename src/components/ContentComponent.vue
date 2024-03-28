<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useSocket } from "../composables/useSocket";
import { toast } from "vue-sonner";
import { formStore } from "../store/formStore";
import { taskStore } from "../store/taskStore";
import { urlServer } from "../constants/constants";

export interface Task {
  uid: number;
  title: string;
  description: string;
  date: string;
  color: string;
}

const { emit, connect, disconnect } = useSocket();
const tasks = ref<Task[]>([]);
const total = ref(0);
const useFormStore = formStore();
const useTaskStore = taskStore();

onMounted(() => {
  connect(urlServer); // Reemplaza con la URL de tu servidor
  // on("get-tasks", (data) => {
  //   tasks.value = data.tasks;
  //   total.value = data.total;
  //   console.log(data);
  // });
  // emit("get-tasks", {});
});

onBeforeUnmount(() => {
  disconnect();
});

const deleteTask = (id: number) => {
  emit("delete-task", { id });
  toast.success("Tarea eliminada");
};

const updateTask = (task: Task) => {
  // emit("update-task", { id, task });
  useFormStore.setSelectedItem(task);
  console.log({ task });
  // toast.success("Tarea actualizada");
};

useTaskStore.$subscribe((mutation, data) => {
  console.log({ mutation });
  console.log({ data });
  tasks.value = data.tasks;
  total.value = data.total;
});
</script>

<template>
  <div class="content__header">
    <span>total : {{ total }} / 15</span>
  </div>
  <div class="content__cards">
    <div class="card" v-for="task in tasks" :key="task.uid">
      <button
        @click="deleteTask(task.uid)"
        class="btn-delete"
        title="Eliminar tarea"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon icon-tabler icons-tabler-outline icon-tabler-circle-minus"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
          <path d="M9 12l6 0" />
        </svg>
      </button>
      <button
        @click="updateTask(task)"
        class="btn-update"
        title="Actualizar tarea"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon icon-tabler icons-tabler-outline icon-tabler-pencil"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
          <path d="M13.5 6.5l4 4" />
        </svg>
      </button>
      <h2 :style="{ background: task.color }">
        {{ task.title }}
      </h2>
      <p>
        <!-- <pre class="description"> -->
        {{ task.description.trim() }}
        <!-- </pre> -->
      </p>
      <p class="date">
        {{ new Date(task.date).toLocaleDateString() }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.content__header {
  width: 100%;
  height: 35px;
  display: flex;
  justify-content: start;
  padding: 0px 5px;
  align-items: center;
  background: linear-gradient(180deg, #6877ff, #7a23a8);
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  border-radius: 1.5px;
}
.content__cards {
  width: 100%;
  height: 100%;
  padding: 20px 0px;
  display: flex;
  flex-wrap: wrap;
  /* justify-content: center; */
  border: 1px solid #fff;
}
.card {
  width: 200px;
  height: 250px;
  border: 1px solid #fff;
  margin: 0 10px;
  padding: 0 0px;
  border-radius: 5px;
  position: relative;
}
.card h2 {
  padding: 5px 10px;
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  background: linear-gradient(180deg, #6877ff, #7a23a8);
}
.card p {
  margin: 0;
  padding: 3px 10px;
  font-size: 15px;
}

.card .description {
}
.card .date {
  font-size: 18px;
  /* color: #333; */
  position: absolute;
  bottom: 5px;
  right: 5px;
}
.btn-delete {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  color: #fff;
  background: #ff4b4b;
  border-radius: 100%;
  opacity: 0;
  transition: opacity 0.3s;
}

.btn-delete:hover {
  background: #ff4b4b;
  opacity: 0.8;
}

.card:hover .btn-delete {
  opacity: 1;
}
.btn-update {
  position: absolute;
  top: 50px;
  right: 5px;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  color: #fff;
  background: #514bff;
  border-radius: 100%;
  opacity: 0;
  transition: opacity 0.3s;
}

.btn-update:hover {
  background: #514bff;
  opacity: 0.8;
}

.card:hover .btn-update {
  opacity: 1;
}
</style>
