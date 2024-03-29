<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { toast } from "vue-sonner";
import { useSocket } from "../composables/useSocket";
import { formStore } from "../store/formStore";
import { taskStore } from "../store/taskStore";
import { Task } from "./ContentComponent.vue";
import { urlServer } from "../constants/constants";
import { Form, Field, ErrorMessage, defineRule } from "vee-validate";

// defineProps<{ msg: string }>()

const date = ref<string | Date>(new Date());
const title = ref("");
const description = ref("");
const color = ref("#005448");
const { connect, disconnect, emit } = useSocket();
const useFormStore = formStore();
const useTaskStore = taskStore();

const tasks = ref<Task[]>([]);
const isInsert = ref(true);
// const selectAttribute = ref({ dot: true });

const updateTask = () => {
  try {
    console.log("update");
    console.log(date.value);
    console.log(title.value);
    console.log(description.value);
    toast.success("Tarea actualizada");
    // Emitir evento al servidor
    emit("update-task", {
      title: title.value,
      description: description.value,
      date: date.value,
      color: color.value,
      uid: useFormStore.$state.selectedItem?.uid,
    });

    // Limpiar campos
    title.value = "";
    description.value = "";
    date.value = new Date();
    color.value = "#005448";
    isInsert.value = true;
  } catch (error) {
    console.log(error);
    toast.error("Error al actualizar la tarea");
  }
};

const insertTask = () => {
  toast.success("Tarea guardada");
  // Emitir evento al servidor
  emit("create-task", {
    title: title.value,
    description: description.value,
    date: date.value,
    color: color.value,
  });

  // Limpiar campos
  title.value = "";
  description.value = "";
  date.value = new Date();
  color.value = "#005448";
};

const handleCancel = () => {
  title.value = "";
  description.value = "";
  date.value = new Date();
  color.value = "#005448";
  isInsert.value = true;
};

const onSubmit = (values: any) => {
  try {
    console.log("submit");
    console.log(values);
    console.log(date.value);
    console.log(title.value);
    console.log(description.value);
    isInsert.value ? insertTask() : updateTask();
  } catch (error) {
    console.log(error);
    toast.error("Error al guardar la tarea");
  }
};

onMounted(() => {
  connect(urlServer); // Reemplaza con la URL de tu servidor
});

onBeforeUnmount(() => {
  disconnect();
});

// const validateRequired = (value: string) => {
//     if (!value) {
//         return { valid: false, message: "Este campo es requerido" };
//     }
//     return true; // Implicitly { valid: true, message: undefined }
// };
defineRule("required", (value: any) => {
  if (!value || !value.length) {
    return "Este campo es requerido";
  }
  return true;
});

const parseDate = (date: string) => {
  const parsedDate = new Date(date);
  if (!isNaN(parsedDate.getTime())) {
    // Check for valid date
    const localDate = parsedDate.toLocaleDateString();
    const formattedDate = `${localDate.split("/")[2]}-${
      localDate.split("/")[1].length === 1
        ? `0${localDate.split("/")[1]}`
        : localDate.split("/")[1]
    }-${
      localDate.split("/")[0].length === 1
        ? `0${localDate.split("/")[0]}`
        : localDate.split("/")[0]
    }`;
    console.log({ formattedDate });
    return formattedDate;
  } else {
    console.error("Invalid date format:");
    return new Date().toLocaleDateString();
  }
};

useFormStore.$subscribe((mutation, task) => {
  console.log({ mutation });
  console.log({ task });
  console.log(new Date(task.selectedItem?.date + "").toLocaleDateString());
  // console.log({ formatedDate });
  title.value = task.selectedItem?.title || "";
  description.value = task.selectedItem?.description || "";
  date.value = parseDate(task.selectedItem?.date + "");
  color.value = task.selectedItem?.color || "#005448";
  isInsert.value = !task.selectedItem;
});

useTaskStore.$subscribe((mutation, data) => {
  console.log({ mutation });
  console.log({ data });
  tasks.value = data.tasks;
});

console.log(useTaskStore.total);
</script>

<template>
  <Form class="form" @submit="onSubmit">
    <span>
      {{ isInsert ? "Agregar tarea" : "Editar tarea" }}
    </span>
    <Field
      name="title"
      type="text"
      placeholder="Ingresa tu tarea"
      class="input-text"
      v-model="title"
      rules="required"
    />
    <ErrorMessage name="title" style="color: #ff0a6c" />
    <Field
      type="text"
      as="textarea"
      name="description"
      id="description"
      cols="30"
      rows="10"
      placeholder="Descripción de la tarea"
      class="input-text"
      v-model="description"
      rules="required"
    ></Field>
    <ErrorMessage name="description" style="color: #ff0a6c" />
    <!-- <VCalendar
      is-dark="{ selector: ':root', darkClass: 'dark' }"
      is-expanded="{ selector: ':root', expandedClass: 'expanded' }"
      v-model="date"
      mode="date"
      is-inline
      :select-attribute="selectAttribute"
      @click="
        () => {
          console.log('click');
          console.log(date);
        }
      "
      class="calendar"
    /> -->
    <Field
      type="date"
      class="input-text"
      v-model="date"
      as="input"
      name="date"
      rules="required"
    />
    <ErrorMessage name="date" style="color: #ff0a6c" />
    <Field
      name="color"
      type="color"
      class="input-text"
      v-model="color"
      rules="required"
    />
    <ErrorMessage name="color" style="color: #ff0a6c" />
    <div
      class=""
      style="border-radius: 5px"
      :style="{
        backgroundColor: color,
        width: '100%',
        height: '2em',
        borderRadius: '5px',
      }"
    ></div>
    <button
      type="submit"
      class="btn btn-primary"
      v-if="tasks.length < 15 ? true : false"
    >
      Guardar
    </button>
    <button
      type="button"
      class="btn btn-danger"
      @click="handleCancel"
      v-if="!isInsert"
    >
      Cancelar
    </button>
  </Form>
</template>
<style scoped>
.input-text {
  width: 95%;
  height: 2em;
  border-radius: 5px;
  border: 1px solid #000;
  padding: 0.5em;
  height: fit-content;
  resize: none;
  font-size: 15px;
}
.calendar {
  width: 90%;
  height: 50%;
  border: 1px solid #000;
}
.btn {
  width: 100%;
  height: 2em;
  border-radius: 5px;
  border: 1px solid #000;
  padding: 0.5em;
  height: fit-content;
  background-color: #000;
  color: #fff;
  cursor: pointer;
  margin-top: 10px;
}
.btn:hover {
  background-color: #fff;
  color: #000;
}
.btn-primary {
  background-color: #000;
  color: #fff;
}
.btn-danger {
  background-color: #ff4b4b;
  color: #fff;
}
.form {
  width: 100%;
}
</style>
