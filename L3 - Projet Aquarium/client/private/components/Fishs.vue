<!-- PONCIN Séverin & PTACEK Charles -->
<template>
  <div id="fish-vue">
    <div id="form-area">
      <div id="fish-container">
        <img
          :src="fish_factory.url"
          alt="fish"
          :style="
            'filter: hue-rotate(' +
            fish_factory.color +
            'deg);' +
            (fish_factory.flip ? 'transform: rotateY(180deg);' : '')
          "
          :height="fish_factory.size * 200"
        />
      </div>
      <form @submit.prevent="addFish" id="fish-factory">
        <label for="name">Name</label>
        <input type="text" name="name" v-model="fish_factory.name" placeholder="Name" required />
        <label for="color">Color : {{ fish_factory.color }}</label>
        <input type="range" name="color" min="1" max="360" v-model="fish_factory.color" class="slider" required />
        <label for="color">Size : {{ fish_factory.size }}</label>
        <input type="range" name="size" v-model.number="fish_factory.size" min="0.10" step="0.01" max="2" required />
        <label for="speed">Speed : {{ fish_factory.speed }}</label>
        <input type="range" name="speed" v-model.number="fish_factory.speed" min="0.10" step="0.01" max="10" required />
        <label for="url">URL</label>
        <input type="text" name="url" v-model.lazy="fish_factory.url" placeholder="URL" required />
        <label for="flip">Flip</label>
        <input type="checkbox" name="flip" v-model="fish_factory.flip" />

        <input v-if="current_modif === undefined" type="submit" value="Créer" />
        <div v-else>
          <input id="button-cancel" type="button" value="annuler" @click="cancelModification()" />
          <input id="button-valid" type="button" value="valider" @click="validModification()" />
        </div>
      </form>
    </div>

    <div id="fishs-container">
      <article v-for="fish in fishs" :key="fish.fishid">
        <div v-if="current_modif === undefined || current_modif.fishid !== fish.fishid">
          <img
            :src="fish.url"
            alt="fish"
            :style="'filter: hue-rotate(' + fish.color + 'deg); ' + (fish.flip ? 'transform: rotateY(180deg);' : '')"
            :height="fish.size * 200"
          />
          <h2>{{ fish.name }}</h2>
          <p>speed : {{ fish.speed }}</p>
          <p class="deletefish" @click="deleteFish(fish.fishid)">❌</p>
          <p class="modifyfish" @click="modifyFish(fish)">⚙️</p>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: {
    user: { type: Object },
    fishs: { type: Array },
  },
  data() {
    return {
      fish_factory: this.createFish(),
      current_modif: undefined,
    };
  },
  methods: {
    addFish() {
      this.$emit("createfish", this.fish_factory);
    },
    deleteFish(fishId) {
      this.$emit("deletefish", fishId);
    },
    modifyFish(fish) {
      this.fish_factory.name = fish.name;
      this.fish_factory.color = fish.color;
      this.fish_factory.speed = fish.speed;
      this.fish_factory.size = fish.size;
      this.fish_factory.url = fish.url;
      this.fish_factory.flip = fish.flip;
      this.current_modif = fish;
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    },
    cancelModification() {
      this.current_modif = undefined;
      this.fish_factory = this.createFish();
    },
    validModification() {
      this.$emit("modifyfish", this.current_modif, this.fish_factory);
      this.current_modif = undefined;
      this.fish_factory = this.createFish();
    },
    createFish() {
      return {
        name: "",
        color: 0,
        speed: 1.5,
        size: 1,
        url: "./aquarium/img/poisson.png",
        flip: false,
      };
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
#fish-vue {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 96px);
}

#fish-factory {
  display: flex;
  flex-direction: column;
  max-width: 500px;
  justify-content: center;
  width: 100%;
}

#fish-container {
  min-width: 400px;
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e8ebee;
  border-radius: 5px;
  margin: 15px;
}

#fishs-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  margin: 40px 0;
  width: 100%;
}

#form-area {
  background-color: #3b82a8;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

article {
  position: relative;
  margin-top: 20px;
  text-align: center;
}

article h2 {
  overflow-x: auto;
  max-width: 300px;
}

.deletefish {
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

.modifyfish {
  position: absolute;
  top: -5px;
  left: 25px;
  padding: 1px;
  font-size: 15px;
  cursor: pointer;
  text-align: center;
  background: #ebf0f3;
  border-radius: 50%;
  box-shadow: 0px 1px 3px black;
}

input[type="button"],
input[type="submit"] {
  font-family: "Sansita Swashed", cursive;
  transition: 0.2s;
  font-size: 20px;
  margin: 30px 0 10px 0;
  cursor: pointer;
  height: 35px;
  width: 200px;
  border-radius: 5px;
  border: solid rgb(0, 0, 0) 2px;
}

input[type="submit"],
#button-valid {
  background: rgb(47, 179, 255);
  background: linear-gradient(90deg, rgba(47, 179, 255, 1) 0%, rgba(151, 196, 222, 1) 100%);
}

input[type="submit"]:active {
  background: rgb(226, 82, 82);
  background: linear-gradient(90deg, rgb(99, 226, 82) 0%, rgb(120, 242, 116) 56%, rgb(184, 251, 182) 100%);
}

input[type="checkbox"] {
  position: relative;
  appearance: none;
  outline: none;
  width: 40px;
  height: 20px;
  background-color: #ffffff;
  border-radius: 40px;
  box-shadow: inset -10px 0 0 0 #ffffff;
  transition-duration: 200ms;
}

input[type="checkbox"]:after {
  content: "";
  position: absolute;
  top: 1px;
  left: 1px;
  width: 18px;
  height: 18px;
  background-color: transparent;
  border-radius: 50%;
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.2);
}

input[type="checkbox"]:checked {
  box-shadow: inset 20px 0 0 0 #4eb3d1;
}

input[type="checkbox"]:checked:after {
  left: 10px;
  box-shadow: -2px 4px 3px rgba(0, 0, 0, 0.05);
}

input[type="button"]:hover,
input[type="submit"]:hover {
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.84);
}

#button-cancel {
  background: rgb(226, 82, 82);
  background: linear-gradient(90deg, rgba(226, 82, 82, 1) 0%, rgba(242, 116, 116, 1) 56%, rgba(251, 205, 144, 1) 100%);
}

@media (max-width: 1080px) {
  #form-area {
    flex-direction: column;
  }
  #fish-factory * {
    margin-left: 30px;
    margin-right: 30px;
  }
  input[type="submit"],
  #button-valid {
    margin-top: 20px;
  }
  #fish-factory > div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
