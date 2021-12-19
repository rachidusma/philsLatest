<template>
  <div class="content">
    <section class="mt-5 container">
      <div class="mt-5 mb-4 is-flex is-justify-content-space-between is-align-items-center">
        <h3>All users:</h3>
        <b-button type="is-info" icon-right="plus" tag="router-link" to="/admin/users/new">
          Add new user
        </b-button>
      </div>
      <b-table
        :data="users"
        hoverable
        :loading="isLoading"
      >
        <b-table-column v-slot="props" searchable field="title" label="Name">
          {{ props.row.name }}
        </b-table-column>

        <b-table-column v-slot="props" searchable field="email" label="Email">
          {{ props.row.email }}
        </b-table-column>

        <b-table-column v-slot="props" searchable field="phone" label="Tel">
          {{ props.row.phone }}
        </b-table-column>

        <b-table-column v-slot="props" searchable field="role" label="Role">
          <b-select :disabled="roleDisabled" :value="props.row.role" placeholder="Select a role" @input="changeRole(props.row, $event)">
            <option value="admin">
              Admin
            </option>
            <option disabled value="Restaurant Owner">
              Restaurant owner
            </option>
            <option value="user">
              User
            </option>
          </b-select>
        </b-table-column>

        <b-table-column v-slot="props" searchable field="createdAt" label="Join Date">
          {{ props.row.createdAt.substr(0, 10) }}
        </b-table-column>

        <b-table-column v-slot="props">
          <b-button type="is-danger" size="is-small" icon-right="delete" @click="deleteUser(props.row._id)" />
          <b-button type="is-warning" size="is-small" icon-right="square-edit-outline" @click="$router.push(`/admin/users/edit/${props.row._id}`)" />
        </b-table-column>

        <template #empty>
          <div class="has-text-centered">
            No Users Yet
          </div>
        </template>
      </b-table>
      <b-modal
        v-model="isCardModalActive"
        has-modal-card
        trap-focus
        :destroy-on-hide="false"
        aria-role="dialog"
        aria-label="Example Modal"
        aria-modal
      >
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
            <p class="modal-card-title">
              Edit Image
            </p>
            <button type="button" class="delete" @click="isCardModalActive = false; userForEdit = {}" />
          </header>
          <section class="modal-card-body">
            <b-field label="Included filename">
              <b-field class="file is-primary" :class="{'has-name': !!file}">
                <b-upload v-model="file" class="file-label" rounded>
                  <span class="file-cta">
                    <b-icon class="file-icon" icon="upload" />
                    <span class="file-label">{{ file.name || "Click to upload" }}</span>
                  </span>
                </b-upload>
              </b-field>
            </b-field>
          </section>
          <footer class="modal-card-foot">
            <b-button label="Close" @click="isCardModalActive = false; userForEdit = {}" />
            <b-button label="Edit image" type="is-primary" @click="editImage" />
          </footer>
        </div>
      </b-modal>
    </section>
  </div>
</template>

<script>
export default {
  name: 'AllUsersPage',
  layout: 'admin',
  data () {
    return {
      isLoading: true,
      file: {},
      roleDisabled: false,
      userForEdit: {},
      isCardModalActive: false,
      users: []
    }
  },
  async mounted () {
    await this.getUsers()
  },
  methods: {
    async getUsers () {
      try {
        const res = await this.$axios.$get('/users')
        this.users = res
        this.isLoading = false
      } catch (err) {
        this.$store.dispatch('notify', { $buefy: this.$buefy, message: err.response.data.msg })
      }
    },
    async changeRole (user, role) {
      this.roleDisabled = true
      try {
        await this.$axios.patch(`/users/${user._id}`, { user: { role } })
        this.users.forEach((userI) => {
          if (userI._id === user._id) {
            userI.role = role
          }
        })
        this.$store.dispatch('notify', { $buefy: this.$buefy, message: 'User role changed', type: 'success' })
      } catch (err) {
        this.$store.dispatch('notify', { $buefy: this.$buefy, message: err.response.data.msg })
      }
      this.roleDisabled = false
    },
    async editImage () {
      if (!this.file.name) {
        this.$store.dispatch('notify', { $buefy: this.$buefy, message: 'Please choose image' })
        return
      }
      const formdata = new FormData()
      formdata.append('img', this.file)
      try {
        const imgRes = await this.$axios.$post('/image/', formdata)
        this.$store.dispatch('notify', { $buefy: this.$buefy, message: 'Image uploaded successfully', type: 'info' })
        await this.$axios.$patch(`/users/${this.userForEdit._id}`, { img: imgRes })
        this.users.forEach((d) => {
          if (d._id === this.userForEdit._id) {
            d.img = imgRes
          }
        })
        this.$store.dispatch('notify', { $buefy: this.$buefy, message: 'User image updated', type: 'success' })
        this.isCardModalActive = false
      } catch (err) {
        this.$store.dispatch('notify', { $buefy: this.$buefy, message: err.response.data.msg })
      }
    },
    deleteUser (id) {
      this.$buefy.dialog.confirm({
        title: 'Deleting User',
        message: 'Are you sure you want to <b>delete</b> this user? This action cannot be undone.',
        confirmText: 'Delete User',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: async () => {
          await this.$axios.$delete(`/users/${id}`)
          await this.getUsers()
          this.$store.dispatch('notify', { $buefy: this.$buefy, message: 'User Deleted successfully', type: 'success' })
        }
      })
    }
  }
}
</script>

<style  scoped>

</style>
