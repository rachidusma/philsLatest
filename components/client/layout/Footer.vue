<template>
  <footer class="px-4 py-6">
    <div class="container">
      <div class="is-flex">
        <div class="is-flex-grow-1">
          <h2 class="logo">
            <img src="/PhilsBurger_Logo_Rund_Sv.png" alt="phil's burger">
          </h2>
          <small>© 2021 Phil's Burger</small>
        </div>

        <div class="is-flex is-justify-content-space-between">
          <div class="pr-6">
            <h5 class="has-text-weight-semibold">
              Get to know us
            </h5>
            <ul>
              <li v-for="link in knowUsList" :key="link.text">
                <nuxt-link :to="link.url">
                  {{ link.text }}
                </nuxt-link>
              </li>
            </ul>
          </div>

          <div>
            <h5 class="has-text-weight-semibold">
              Social
            </h5>

            <div class="social">
              <a href="https://www.facebook.com" class="mr-1 is-size-3" target="_blank" rel="noopener noreferrer">
                <i class="ri-facebook-box-fill" />
              </a>
              <a href="https://www.instagram.com/" class="mr-1 is-size-3" target="_blank" rel="noopener noreferrer">
                <i class="ri-instagram-line" />
              </a>
              <a href="https://www.linkedin.com/" class="is-size-3" target="_blank" rel="noopener noreferrer">
                <i class="ri-linkedin-box-fill" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  data () {
    return {
      knowUsList: [
        { text: 'Add your restaurant', url: '/' },
        { text: 'About Phil\'s Burger', url: '/' },
        { text: 'Contact Phil\'s Burger', url: '/' },
        { text: 'Work with us', url: '/' }
      ]
    }
  }
}
</script>

<style scoped>
footer {
  background: rgb(237, 242, 247);
}
footer .container > div h2.logo img {
  width: 100px
}

@media screen and (max-width: 768px) {
  footer .container > div {
    flex-direction: column;
  }

  footer .container > div > .is-flex-grow-1 {
    margin-bottom: 10px;
  }
}

.logo {
  color: rgb(8, 70, 37);
  font-size: 2.25rem;
  line-height: 1.25;
  font-weight: 700;
  margin-bottom: 0.5rem;
  margin-bottom: 10px;
}

footer a {
  color: rgb(74, 85, 104);
}

footer a:hover {
  text-decoration: underline;
}

footer .social a:hover {
  text-decoration: none;
}
</style>
