<!-- PONCIN Séverin & PTACEK Charles -->
<template>
  <div id="background-vue">
    <div id="form-area">
      <img v-if="url_preview" :src="url_preview" />
      <img v-else-if="url_saisie" :src="url_saisie" />
      <div v-else id="void-preview">
        <p>Preview<br /><br />Upload</p>
      </div>

      <div id="form-container">
        <form action="/api/background" method="post" enctype="multipart/form-data" @submit.prevent="sendImage">
          <input id="input-file" type="file" name="image" enctype="multipart/form-data" @change="onFileChange" />
          <input type="submit" value="upload" />
        </form>

        <p>Ou</p>

        <form action="/api/background" @submit.prevent="sendImageURL">
          <input type="text" placeholder="url" v-model.lazy="url_saisie" />
          <input type="submit" value="add" />
        </form>
      </div>
    </div>

    <img :src="background.url" alt="current background" />

    <div id="backgrounds">
      <div class="background" v-for="back in backgrounds" :key="back.backgroundid">
        <img
          v-if="back.backgroundid !== background.backgroundid"
          :src="back.url"
          alt="background"
          @click="setCurrentBackground(back.backgroundid)"
        />
        <p
          v-if="back.backgroundid !== background.backgroundid"
          class="deleteback"
          @click="deleteBackground(back.backgroundid)"
        >
          ❌
        </p>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: {
    user: { type: Object, default: undefined },
    backgrounds: { type: Array, default: [] },
    background: { type: Object, default: { id: -1, url: "./aquarium/img/background.jpg" } },
  },
  data() {
    return {
      url_preview: null,
      url_saisie: null,
      file: undefined,
    };
  },
  methods: {
    onFileChange(e) {
      this.file = e.target.files[0];
      this.url_preview = URL.createObjectURL(this.file);
    },
    sendImage() {
      if (!this.file) return;
      const formData = new FormData();
      formData.append("image", this.file);
      formData.append("id", 7878);
      this.$emit("sendbackground", formData);
      document.getElementById("input-file").value = null;
      this.url_preview = null;
    },
    sendImageURL() {
      if (!this.url_saisie) {
        return;
      }
      this.$emit("sendbackground", this.url_saisie);
    },
    setCurrentBackground(id) {
      this.$emit("setcurrentbackground", id);
    },
    deleteBackground(id) {
      this.$emit("deletebackground", id);
    },
  },
  beforeRouteEnter(to, from, next) {
    axios
      .get("/api/me")
      .then((res) => next())
      .catch((err) => next("/login"));
  },
};
</script>

<style scoped>
#background-vue,
form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#background-vue {
  min-height: calc(100vh - 96px);
}

#background-vue > img {
  margin: 20px;
  -webkit-box-shadow: 0px 0px 15px 12px rgba(156, 202, 255, 1);
  -moz-box-shadow: 0px 0px 15px 12px rgba(156, 202, 255, 1);
  box-shadow: 0px 0px 15px 12px rgba(156, 202, 255, 1);
  border: 10px ridge #007486;
}

#form-area {
  background-color: #3b82a8;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

#form-area > img {
  border-radius: 5px;
  margin: 15px;
}

#form-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#void-preview {
  width: 250px;
  height: 250px;
  background-color: rgb(232, 235, 238);
  border-radius: 5px;
  margin: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(87, 87, 87);
}

img {
  max-height: 250px;
}

#backgrounds {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.background {
  position: relative;
}

form,
form input {
  width: 100%;
}

#form-container > * {
  margin: 5px 0;
}

.background img {
  min-width: 50px;
  min-height: 50px;
  margin: 10px;
  transition: 0.4s;
  -webkit-box-shadow: 1px 2px 5px 0px rgba(0, 0, 0, 0.34);
  -moz-box-shadow: 1px 2px 5px 0px rgba(0, 0, 0, 0.34);
  box-shadow: 1px 2px 5px 0px rgba(0, 0, 0, 0.34);
}

.background img:hover {
  transform: scale(1.05);
  -webkit-box-shadow: 1px 7px 13px 0px rgba(0, 0, 0, 0.34);
  -moz-box-shadow: 1px 7px 13px 0px rgba(0, 0, 0, 0.34);
  box-shadow: 1px 7px 13px 0px rgba(0, 0, 0, 0.34);
}

.deleteback {
  position: absolute;
  top: -5px;
  left: -5px;
  padding: 1px;
  font-size: 15px;
  cursor: pointer;
  text-align: center;
  background: #ebf0f3;
  border-radius: 50%;
  box-shadow: 0px 1px 3px black;
}

input[type="submit"] {
  font-family: "Sansita Swashed", cursive;
  transition: 0.2s;
  font-size: 18px;
  margin: 10px 0 10px 0;
  cursor: pointer;
  height: 30px;
  width: 200px;
  border-radius: 5px;
  border: none;
  border: solid rgb(0, 0, 0) 2px;
  background: rgb(47, 179, 255);
  background: linear-gradient(90deg, rgba(47, 179, 255, 1) 0%, rgba(151, 196, 222, 1) 100%);
}
input[type="submit"]:hover {
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.84);
}
</style>
