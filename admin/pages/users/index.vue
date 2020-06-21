<template>
  <div>
    <v-card>
      <v-card-title>
        Users list
        <v-spacer />
        <v-btn class="mr-3" @click="showSearch = !showSearch">
          Filter options
          <v-icon>{{ showSearch ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>

        <v-dialog v-if="canWrite" v-model="showEdit" persistent scrollable max-width="500">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" v-on="on" @click="createItem">
              Create new user
            </v-btn>
          </template>

          <edit-form v-model="editedItem" @reload="reload" @close="showEdit = false" />
        </v-dialog>
      </v-card-title>

      <v-card-text>
        <v-expand-transition>
          <search-form v-show="showSearch" v-model="filter" />
        </v-expand-transition>

        <v-data-table
          :headers="headers"
          :items="items"
          :server-items-length="totalItems"
          :options.sync="datatables.options"
          :footer-props="datatables.footerProps"
          :loading="loading"
          item-key="_id"
          single-expand
          show-expand
        >
          <template v-slot:item.action="{ item }">
            <v-btn v-if="canWrite" icon @click.stop="editItem(item)">
              <v-icon>mdi-square-edit-outline</v-icon>
            </v-btn>
            <v-btn v-if="canDelete" icon @click.stop="deleteItem(item)">
              <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
          </template>

          <template v-slot:item.lastLoginTime="{ item }">
            {{ item.lastLoginTime | timestamp }}
          </template>

          <template v-slot:item.role="{ item }">
            <status-chips :status="item.role" />
          </template>

          <template v-slot:item.access="{ item }">
            <status-chips :status="item.access" />
          </template>

          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              <v-chip>Created: {{ item.createdTime | timestamp }}</v-chip>
              <v-chip>Last modified: {{ item.lastModifiedTime | timestamp }}</v-chip>
            </td>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="showDelete" max-width="500" persistent>
      <delete-form v-model="editedItem" @reload="reload" @close="showDelete = false" />
    </v-dialog>
  </div>
</template>

<script>
import datatablesMixin from '~/mixins/datatables'
import permissionsMixin from '~/mixins/permissions'

export default {
  components: {
    StatusChips: () => import('~/components/StatusChips'),
    SearchForm: () => import('~/components/pages/users/SearchForm'),
    EditForm: () => import('~/components/pages/users/EditForm'),
    DeleteForm: () => import('~/components/pages/users/DeleteForm')
  },
  mixins: [datatablesMixin, permissionsMixin],
  async fetch () {
    try {
      this.loading = true
      const { items, totalItems } = await this.$axios.get('users', {
        params: {
          ...this.datatables.options,
          'filter[attribute]': [
            'username',
            'email',
            'role',
            'access'
          ],
          'filter[value]': [
            this.filter.username || '',
            this.filter.email || '',
            this.filter.role || '',
            this.filter.access || ''
          ],
          'filter[type]': [
            'regexp',
            'regexp',
            '',
            ''
          ],
          'filter[operator]': [
            '',
            '',
            '',
            ''
          ]
        }
      })

      this.items = items
      this.totalItems = totalItems
    } catch (err) {
    } finally {
      this.loading = false
    }
  },
  data: () => ({
    headers: [
      {
        text: 'Username',
        value: 'username'
      },
      {
        text: 'Email',
        value: 'email'
      },
      {
        text: 'Role',
        value: 'role'
      },
      {
        text: 'Access',
        value: 'access'
      },
      {
        text: 'Last login',
        value: 'lastLoginTime'
      },
      {
        text: 'Action',
        value: 'action',
        sortable: false
      },
      {
        text: '',
        value: 'data-table-expand'
      }
    ],
    filter: {
      username: '',
      email: '',
      role: '',
      access: ''
    },
    editedItem: {
      username: '',
      email: '',
      role: '',
      access: ''
    },
    showDelete: false,
    showEdit: false,
    showSearch: false,
    loading: false,
    items: [],
    totalItems: 0
  }),
  watch: {
    'datatables.options': {
      handler () {
        this.$fetch()
      },
      deep: true
    },
    filter: {
      handler () {
        this.datatables.options.page = 1
        this.$fetch()
      },
      deep: true
    }
  },
  methods: {
    createItem () {
      this.editedItem = {
        username: '',
        email: '',
        role: '',
        access: ''
      }
    },
    editItem (item) {
      const { _id, username, email, role, access } = item
      this.editedItem = { _id, username, email, role, access }
      this.showEdit = true
    },
    deleteItem (item) {
      const { _id } = item
      this.editedItem = { _id }
      this.showDelete = true
    },
    reload () {
      this.$fetch()
    }
  },
  meta: {
    title: 'Users'
  }
}
</script>
