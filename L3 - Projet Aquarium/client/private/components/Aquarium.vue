<!-- PONCIN Séverin & PTACEK Charles -->
<template>
  <div id="aquarium-vue" :style="{backgroundImage: 'url('+background.url+')'}">
    <div v-for='(fish, index) in fishs' :key='fish.fishid' class="fish" :style="getStyleDiv(fish,index)" ref="fish">
      <img :src="fish.url" alt="fish"
      :style="getStyleFish(fish,index)"
      :height="fish.size * 200" :max-width="fish.size * 400">
      <h2>{{fish.name}}</h2>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: {
    user: { type: Object },
    fishs: { type: Array },
    background: { type: Object }
  },
  data () {
    return {
      taskInterval: undefined,
      taskTimeout: undefined,
      fishsMove: []
    }
  },
  async mounted(){
    this.taskTimeout = setTimeout(() => {
      /**
       * Initialisation
       */
      for (let i = 0; i < this.fishs.length; i++) {
        this.initializeFishMove(this.fishs[i], i)
      }
      
      /**
       * Animation
       */
      this.taskInterval = setInterval(() => {
        let move;
        let fish;
        for (let i = 0; i < this.fishs.length; i++) {
          fish = this.fishs[i];
          move = this.fishsMove[i];
          if(move === undefined)
            move = this.initializeFishMove(fish, i)

          /** Changement de direction du poisson à un instant aléatoire */
          move.counterChangeDirection--;
          if(move.counterChangeDirection <= 0) {
            let angle = Math.floor(Math.random() * Math.floor(360));
            move.vx = Math.cos(angle),
            move.vy = Math.sin(angle),
            move.rotate.xmax = this.calculFishOrientationX(fish,move);
            move.rotate.ymax = (move.vx < 0 ? 180 : 0)
            move.counterChangeDirection = Math.floor(Math.random() * Math.floor(2000)) + 500
          }

          if(move.rotate.y !== move.rotate.ymax || move.rotate.x !== move.rotate.xmax){
            /** Déplacement rotation */
            this.animatedRotation(fish,move)
          }else{
            /** Déplacement axe x y */
            move.x += fish.speed * move.vx;
            move.y += fish.speed * move.vy;
            this.checkOutOfWindow(fish,move)

            /** Animation fish ondule */
            move.angle += move.vr * fish.speed;
            if(move.angle < -35 || move.angle > 35){
              move.vr *= -1
            }
          }
        }
      }, 16);
    },200);
  },
  beforeDestroy(){
    clearInterval(this.taskInterval)
    clearTimeout(this.taskTimeout)
  },
  methods: {
    calculFishOrientationX(fish,move){
      let angle = (Math.atan(Math.abs(move.vy)/Math.abs(move.vx)) * 180) / Math.PI
      if(move.vy < 0)
        angle *= -1
      return Math.round(angle) * (fish.flip ? -1 : 1);
    },
    checkOutOfWindow(fish,move){
      if(move.x > window.innerWidth - move.width) {
        move.x = window.innerWidth - move.width
        move.vx *= - Math.min(Math.random() + 0.20, 1)
        move.rotate.ymax = 180
        move.rotate.xmax = this.calculFishOrientationX(fish,move);
      }else if(move.x <= 0){
        move.x = 0
        move.vx *= -Math.min(Math.random() + 0.20, 1)
        move.rotate.ymax = 0
        move.rotate.xmax = this.calculFishOrientationX(fish,move);
      }
      if(move.y > window.innerHeight - move.height-48) {
        move.y = window.innerHeight - move.height-48
        move.vy *= - Math.min(Math.random() + 0.20, 1)
        move.rotate.xmax = this.calculFishOrientationX(fish,move);
      }else if(move.y <= 0){
        move.y = 0
        move.vy *= -Math.min(Math.random() + 0.20, 1)
        move.rotate.xmax = this.calculFishOrientationX(fish,move);
      }
    },
    animatedRotation(fish, move){
      if(move.rotate.y < move.rotate.ymax)
        move.rotate.y = Math.min(move.rotate.y+fish.speed,move.rotate.ymax)
      else if(move.rotate.y > move.rotate.ymax)
        move.rotate.y = Math.max(move.rotate.y-fish.speed,move.rotate.ymax)
      
      if(move.rotate.x < move.rotate.xmax) {
        move.rotate.x = Math.min(move.rotate.x+ fish.speed,move.rotate.xmax)
      }else if(move.rotate.x > move.rotate.xmax)
        move.rotate.x = Math.max(move.rotate.x- fish.speed,move.rotate.xmax)
    },
    initializeFishMove(fish, index){
      let angle = Math.floor(Math.random() * Math.floor(360));
      const move = {
        fishid: fish.fishid,
        x: Math.floor(Math.random() * Math.floor(window.innerWidth)),
        y: Math.floor(Math.random() * Math.floor(window.innerHeight)),
        vx: Math.cos(angle),
        vy: Math.sin(angle),
        vr: 0.3,
        rotate: {
          x: 0,
          y: 0,
          xmax: 0,
          ymax: 0
        },
        angle: 0,
        counterChangeDirection: (Math.floor(Math.random() * Math.floor(500)) + 500),
        height: this.$refs.fish[index].clientHeight,
        width: this.$refs.fish[index].clientWidth
      }

      this.fishsMove.push(move);
      
      if(move.x > window.innerWidth - move.width)
        move.x = window.innerWidth - move.width
      if(move.y > window.innerHeight - move.height-48)
        move.y = window.innerHeight - move.height-48
      move.rotate.x = move.rotate.xmax = this.calculFishOrientationX(fish,move);
      move.rotate.y = move.rotate.ymax = (move.vx < 0 ? 180 : 0)
      return move;
    },
    getStyleFish(fish,index) {
      const move = this.fishsMove[index]

      if(move === undefined)
        return {filter: 'hue-rotate('+fish.color+'deg)'}

      return {
        filter: 'hue-rotate('+fish.color+'deg)',
        transform: "rotatey("+(move.angle + move.rotate.y +(fish.flip ? 180 : 0))+"deg) rotatez("+move.rotate.x+"deg)"
      }
    },
    getStyleDiv(fish,index) {
      const move = this.fishsMove[index]
      if(move === undefined)
        return ''
      return {transform: "translate("+move.x+"px, "+move.y+"px)"}
    }
  },
  beforeRouteEnter(to, from, next){
    axios.get('/api/me').then(res => next()).catch(err => next('/login'))
  }
}
</script>

<style>
  body {
    overflow-x: hidden;
  }
</style>

<style scoped>
#aquarium-vue {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 48px);
  background-size: 100% 100%;
  position: relative;
  overflow: hidden;
}
.fish {
   position: absolute;
   box-shadow: black;
}

.fish h2{
  display: none;
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translate(-50%, 0);
}

.fish:hover h2 {
  display: block;
  background-color: rgba(38, 50, 56, 0.589);
  color: white;
  padding: 2px 10px;
  border-radius: 8px;
  max-width: 200px;
}
</style>
