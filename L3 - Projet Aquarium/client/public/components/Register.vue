<!-- PONCIN Séverin & PTACEK Charles -->
<template>
  <div id="main-register">
    <form @submit.prevent="register">
      <h2>Register</h2>
      <input type="text" v-model="email" placeholder="Username" required>
      <input type="password" v-model="password" placeholder="Password" required :class="{error : password !== passwordConfirm}">
      <input type="password" v-model="passwordConfirm" placeholder="Password confirm" required :class="{error : password !== passwordConfirm}">
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
module.exports = {
  props: {
    user: { type: Object, default: undefined }
  },
  data() {
    return {
      email: "",
      password: "",
      passwordConfirm: ""
    }
  },
  methods: {
   async register(){
      if(this.password !== this.passwordConfirm)
        return
      this.$emit("registeruser", { email: this.email, password: this.password });
    }
  },
  beforeRouteEnter(to, from, next){
    axios.get('/api/me').then(res => next('/aquarium')).catch(err => next())
  }
}
</script>

<style scoped>
 #main-register {
   display: flex;
   justify-content: center;
 }

.error {
  -webkit-box-shadow: 0px 0px 3px rgba(255, 0, 0, 0.93);
  -moz-box-shadow: 0px 0px 3px  rgba(255,0,0,0.93);
  box-shadow: 0px 0px 3px  rgba(255,0,0,0.93);
  background-color: rgb(255, 235, 235);
}
form input:invalid {
  -webkit-box-shadow: 0px 0px 3px rgba(255, 0, 0, 0.93);
  -moz-box-shadow: 0px 0px 3px  rgba(255,0,0,0.93);
  box-shadow: 0px 0px 3px  rgba(255,0,0,0.93);
  background-color: rgb(255, 235, 235);
}

form {
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  flex-direction: column;
  padding: 2em 4em;
  border-radius: 10px;
  background: rgb(237,240,243);
  background: linear-gradient(0deg, rgb(216, 216, 216) 0%, rgba(255,255,255,1) 71%);
  max-width: 300px;
}
form h2{
  margin: 0 0 30px 0;
}
form input{
  margin: 2px 0;
  width: 200px;
  font-size: 18px;
  border-radius: 5px;
  padding: 6px;
  border: none;
  -webkit-box-shadow: 0px 0px 3px rgba(0,0,0,0.93);
  -moz-box-shadow: 0px 0px 3px  rgba(0,0,0,0.93);
  box-shadow: 0px 0px 3px  rgba(0,0,0,0.93);
}

button{
  font-family: 'Sansita Swashed', cursive;
  transition: 0.2s;
  font-size: 20px;
  margin: 30px 0 10px 0;
  cursor: pointer;
  height: 35px;
  width:200px;
  border-radius: 5px;
  border: none;
  border: solid rgb(0, 0, 0) 2px;
  background: rgb(47,179,255);
  background: linear-gradient(90deg, rgba(47,179,255,1) 0%, rgba(151,196,222,1) 100%); 
}

button:hover {
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.84);
}
</style>
