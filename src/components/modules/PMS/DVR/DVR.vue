<template>
  <b-container class="m-2 mt-2">
    <div>   <!-- Title and desc -->
      <h2>
        {{ $t(`Modules.PMS.DVR.Name`) }}
      </h2>
      <h5>{{ $t(`Modules.PMS.DVR.Description`) }}</h5>
    </div>
    <b-link id="general" :to="{ path: '/settings/export', query: { return: 'dvr' } }">{{ $t("Modules.ET.Settings.Note") }} </b-link>
    <br>
    <br>
    <div class="d-flex align-items-center">
      <b-form-group name="dvrSelDVRGroup">
        <WTNGttlabel tt="Modules.PMS.DVR.ttselDVR" label="Modules.PMS.DVR.selDVR" />
        <b-form-select
          v-model="selDVR"
          id="selDVR"
          :options="optSelDVR"
          style="width: auto"
          name="selDVR">
        </b-form-select>
      </b-form-group>
    </div>
    <br>
    <br>
    <div class="buttons">
      <!-- Buttons -->
      <div id="buttons" class="text-center">
        <b-button-group >
          <b-button
            class="mr-2"
            type="is-primary"
            @click="dvrBackup"
            icon-left="fas fa-file-download"
            icon-pack="fas"
            :disabled="this.selDVR == ''"
            variant="success"
            >
            {{ $t("Modules.PMS.DVR.lblBtnBackup") }}
          </b-button>
          <b-button
            class="mr-2"
            type="is-primary"
            @click="dvrRestore"
            icon-left="fas fa-file-download"
            icon-pack="fas"
            :disabled=!this.serverIsSelected
            variant="success"
            >
            {{ $t("Modules.PMS.DVR.lblBtnRestore") }}
          </b-button>
        </b-button-group>
      </div>
    </div>
  </b-container>
</template>

<script>
  import i18n from '../../../../i18n';
  //import store from '../../../store';
  //import { wtconfig } from '../General/wtutils';
  import { dvr } from "./scripts/dvr";
  import WTNGttlabel from './../../General/wtng-ttlabel.vue'

  i18n, dvr

  const log = require("electron-log");
  export default {
    components: {
            WTNGttlabel
        },
    data() {
      return {
        optSelDVR: [],
        selDVR: "",
        serverIsSelected: false
      };
  },
  created() {
    log.info("DVR Created");
    this.serverSelected();
    this.optSelDVR = this.getDVRList();
  },
  watch: {
    // Watch for when selected server address is updated
    selectedServerAddress: async function(){
      log.info("DVR Selected server changed");
      this.optSelDVR = this.getDVRList();
      this.serverIsSelected = ( this.$store.getters.getSelectedServer != "none" );
    },
    doneDVRBackup: async function(){
      if (this.$store.getters.doneDVRBackup!='')
      {
        this.$bvToast.toast(this.$t(this.$store.getters.doneDVRBackup), {
          title: this.$t("Modules.PMS.DVR.BackupDone"),
          autoHideDelay: 4000,
          solid: true,
          variant: 'primary',
          toaster: 'b-toaster-bottom-right'
        });
      }
    }
  },
  computed: {
    // We need this computed, for watching for changes to selected server
    selectedServerAddress: function(){
      return this.$store.getters.getSelectedServerAddress
    },
    doneDVRBackup: function(){
      return this.$store.getters.doneDVRBackup
    }

  },
  methods: {
    async dvrRestore() {
      log.info("DVR Restore started");
      //dvr.backupDVR( {'dvrName': this.selDVR} );
      dvr.restoreDVR();
    },
    async dvrBackup() {
      log.info("DVR Backup started");
      dvr.backupDVR( {'dvrName': this.selDVR} );
    },
    async getDVRList() {
      this.optSelDVR = await dvr.getDVRList();
    },

    /* Check if a server is selected, and if not
    tell user, and disable backup */
    async serverSelected() {
      let serverCheck = this.$store.getters.getSelectedServer;
      this.serverIsSelected = ( this.$store.getters.getSelectedServer != "none" );
      if (serverCheck == "none") {
        log.debug("serverCheck is none");
        this.selDVR = "";
        this.$bvToast.toast(this.$t("Modules.PMS.ErrorNoServerSelectedMsg"), {
          title: this.$t("Modules.PMS.ErrorNoServerSelectedTitle"),
          autoHideDelay: 4000,
          solid: true,
          variant: 'primary',
          toaster: 'b-toaster-bottom-right'
        });
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#sync-button {
  margin-left: 1em;
}
</style>
