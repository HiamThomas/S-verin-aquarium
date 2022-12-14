<!-- PONCIN Séverin & PTACEK Charles -->
<template>
  <div id="main-div">
    <div id="first-area">
      <div id="title-container">
        <h1>Créez votre propre aquarium !</h1>
        <a :href="(user ? '#/aquarium' : '#/login')">Créer mon aquarium  ➤</a>
      </div>
      <div id="fishs-container">
        <img id="fish-1" src="/img/poisson.png" alt="fish">
        <img id="fish-2" src="/img/poisson.png" alt="fish">
        <img id="fish-3" src="/img/poisson.png" alt="fish">
      </div>
    </div>
    <div id="presentation-container">
        <div>
          <h2>Personnalisez et créez vos poissons !</h2>
          <img src="/img/preview-fish-edition.png" alt="preview-fish-edition">
        </div>
        <span></span>
        <div>
          <img src="/img/preview-background-edition.png" alt="preview-background-edition">
          <h2>Personnalisez votre aquarium !</h2>
        </div>
      </div>
  </div>
</template>

<script>
module.exports = {
  props: {
    user: { type: Object, default: undefined },
  }
};
</script>

<style scoped>

#title-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#title-container a {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #000;
  font-family: 'Sansita Swashed', cursive;
  transition: 0.2s;
  font-size: 20px;
  margin: 30px 0 10px 0;
  height: 45px;
  width: 350px;
  border-radius: 5px;
  border: solid rgb(0, 0, 0) 2px;
  background: rgb(47,179,255);
  background: linear-gradient(90deg, rgba(47,179,255,1) 0%, rgba(151,196,222,1) 100%);
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.84);
}

#title-container a:hover {
  box-shadow: 2px 2px 8px rgba(255, 255, 255, 1);
}

#presentation-container {
  width: 100%;
}
#presentation-container div{
  display: flex;
  justify-content: space-evenly;
  margin: 7em 0;
  align-items: center;
  text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.411);
}
#presentation-container span{
  display: block;
  border: 1px solid black;
  width: 50vw;
  margin: 0 auto;
}

#presentation-container div img{
  height: 200px;
  -webkit-box-shadow:  0px 0px 10px 7px rgba(156,202,255,1);
  -moz-box-shadow:  0px 0px 10px 7px rgba(156,202,255,1);
  box-shadow:  0px 0px 10px 7px rgba(156,202,255,1);
  transition-duration: 1s;
}

#presentation-container div img:first-child {
  transform: rotateZ(-5deg);
}

#presentation-container div img:last-child {
  transform: rotateZ(5deg);
}

#presentation-container div img:hover{
  transform: scale(1.5);
}

#main-div {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#first-area{
  background-image: url("/img/background.png");
  background-size: cover;
  min-height: calc(100vh - 48px);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

#first-area h1 {
  font-size: 50px;
  font-family: 'Sansita Swashed', cursive;
  margin-bottom: 8px;
  color: white;
  text-shadow: 2px 2px 5px black;
}

#fishs-container{
  position: relative;
  width: 30em;
  height: 28em;
}

#fishs-container img{
  position: absolute;
  animation: 2s moveFish infinite;
}

#fish-1{
  top: 15%;
  left: 20%;
  height: 200px;
  transform: translate(0,-50%);
}
#fish-2{
  top: 50%;
  left: 12%;
  transform: translate(0,-50%);
  filter: hue-rotate(278deg);
  height: 120px;
}
#fish-3{
  top: 47%;
  left: 48%;
  transform: translate(0,-50%);
  height: 100px;
  filter: hue-rotate(150deg);
}

@media (max-width:1080px) {
    #first-area{
      flex-direction: column-reverse;
      text-align: center;
    }
    #presentation-container div{
      flex-direction: column;
    }
    #presentation-container div h2 {
      margin-bottom: 50px;
      margin-right: 10px;
      margin-left: 10px;
      text-align: center;
    }
    #presentation-container div:last-child {
      display: flex;
      flex-direction: column-reverse;
    }
}

@keyframes moveFish {
  0% {
    translate: -10px;
    transform: rotateY(20deg);
  }
  25%{
    transform: rotateY(-20deg);
  }
  75% {
    transform: rotateY(20deg);
    translate: 10px;
  }
  100% {
    translate: -10px;
    transform: rotateY(20deg);
  }
}

</style>
