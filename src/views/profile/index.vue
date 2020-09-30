<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
               <!-- <avatar-upload/> -->
              <!-- <el-tab-pane label="Activity" name="activity">
                <activity />
              </el-tab-pane>
              <el-tab-pane label="Timeline" name="timeline">
                <timeline />
              </el-tab-pane> -->
              <el-tab-pane label="修改个人资料" name="account">
                <account :user="user" />
              </el-tab-pane>
              <el-tab-pane label="修改密码" name="passwordReset">
                <passwordReset />
              </el-tab-pane> 

            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import store from '@/store'
// import Activity from './components/Activity'
// import Timeline from './components/Timeline'
import Account from './components/Account'
import passwordReset from './components/passwordReset'
// import avatarupload from './components/AvatarUpload'

export default {
  name: 'Profile',
  components: { UserCard, Account,passwordReset },//Activity, Timeline,
  data() {
    return {
      user: {},
      activeTab: 'account'
    }
  },
  computed: {
   
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
     
      this.user = {
        name: store.getters.user.username,
        // role: this.roles.join(' | '),
        phone:store.getters.user.phone, 
        avatar: store.getters.user.avatar,
        roles:store.getters.user.roles,
        deptName:store.getters.user.fullPathDeptName

      }
    }
  }
}
</script>
