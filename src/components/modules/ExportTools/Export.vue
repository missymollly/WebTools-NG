<template>
  <b-container class="m-2 mt-2">
    <div class="float-right">   <!-- Settings button hidden with d-none -->
      <div class="buttons">
        <!-- Buttons -->
        <b-button-group id="settings">
          <b-tooltip target="settings" triggers="hover">
              {{ $t(`Modules.${this.PageName}.ttSettings`) }}
          </b-tooltip>
          <button class="btn btn-outline-success" @click="showSettings"><i class="fa fa-cog"></i></button>
        </b-button-group>
      </div>
    </div>
    <div>   <!-- Title and desc -->
      <h2>
        {{ $t(`Modules.${this.PageName}.Name`) }}
      </h2>
      <h5>{{ $t(`Modules.${this.PageName}.Description`) }}</h5>
    </div>
    <br>
    <div class="col-lg-10 col-md-12 col-xs-12">
      <b-form-row> <!-- Select Export type -->
        <b-col> <!-- Main type -->
          <div class="d-flex align-items-center">
            <b-form-group>
              <WTNGttlabel tt="Modules.ET.optExpType.ttExpType" label="Modules.ET.optExpType.lblMainExp" />
              <b-form-select
                v-model="selExpTypeMain"
                id="selExpTypeMain"
                :options="optExpTypeMain"
                @change="selExpTypeMainChanged"
                name="selExpTypeMain">
              </b-form-select>
            </b-form-group>
          </div>
        </b-col>
        <b-col> <!-- Sec type -->
          <div class="d-flex align-items-center">
            <b-form-group>
              <WTNGttlabel tt="Modules.ET.optExpType.ttExpTypeSec" label="Modules.ET.optExpType.lblSecExp" />
              <b-form-select
                v-model="selExpTypeSec"
                id="selExpTypeSec"
                :options="optExpTypeSec"
                @change="selExpTypeSecChanged"
                name="selExpTypeSec">
              </b-form-select>
            </b-form-group>
          </div>
        </b-col>
      </b-form-row>
      <b-form-row> <!-- Select Library -->
        <b-col>
          <div class="d-flex align-items-center">
            <b-form-group :disabled=this.etLibraryGroupDisabled>
              <WTNGttlabel tt="Modules.ET.optExpType.ttExpLibrary" label="Modules.ET.optExpType.lblSelectSelection" />
              <div ref="libSpinner" id="libSpinner" :hidden="selLibraryWait">
                <b-spinner id="libLoad" class="ml-auto text-danger"></b-spinner>
              </div>
              <b-form-select
                v-model="selLibrary"
                id="selLibrary"
                :options="selLibraryOptions"
                @change="selLibraryChanged"
                name="selLibrary">
              </b-form-select>
            </b-form-group>
          </div>
        </b-col>
      </b-form-row>
      <b-form-row> <!-- Select Export Level -->
        <b-col>
          <div>
            <b-form-group :disabled=this.etLevelGroupDisabled>
              <WTNGttlabel tt="Modules.ET.optExpType.ttExpLevel" label="Modules.ET.optExpType.lblExportLevel" />
              <b-form-select
                class="form-control"
                v-model="selLevel"
                id="selLevel"
                :options="exportLevels"
                @change="selLevelChanged"
                name="selLevel">
              </b-form-select>
            </b-form-group>
          </div>
        </b-col>
      </b-form-row>
      <div class="buttons"> <!-- Buttons -->
        <b-button
          type="is-primary"
          @click="showStartEnd"
          icon-left="fas fa-file-download"
          icon-pack="fas"
          :disabled="btnDisable == true"
          variant="success"
        >
        {{ $t("Modules.ET.optExpType.lblBtnExportMedia") }}</b-button>
      </div>
      <br>
      <statusDiv /> <!-- Status Div -->
      <b-modal ref="startEnd" hide-footer v-bind:title=this.startEnd>
          <div class="d-block">
            {{ this.startEndBody }}
            {{ this.startEndBody2 }}
            <br>
            {{ this.startEndBody3 }}
            <br>
            <br>
            {{ this.startEndBody4 }}
            <br>
            <br>
            <b-input-group id="itemStart" :prepend="$t('Modules.ET.optExpType.startStopStartingItem')" class="mt-3">
              <b-form-input id="itemStartNo" name="itemStartNo" type="number" class="form-control" v-model="itemStartNo" :min=0 :max=this.sectionMaxItems.toString() :disabled=false @change.native="setItemStartNo()"></b-form-input>
            </b-input-group>
            <b-input-group id="itemEnd" :prepend="$t('Modules.ET.optExpType.startStopEndingItem')" class="mt-3">
              <b-form-input id="itemEndNo" name="itemEndNo" type="number" class="form-control" v-model="itemEndNo" :disabled=false :min=this.itemStartNo.toString() :max=this.sectionMaxItems.toString() @change.native="setItemEndNo()"></b-form-input>
            </b-input-group>
          </div>
        <b-button class="mt-3" variant="success" block @click="getMedia">{{ this.startEndBtn }}</b-button>
      </b-modal>
    </div>
  </b-container>
</template>

<script>
  import { et } from "./scripts/et";
  import i18n from '../../../i18n';
  import { wtconfig } from '../General/wtutils';
  import { etHelper } from "./scripts/ethelper";
  import statusDiv from '../General/status.vue';
  import { status } from '../General/status';
  import WTNGttlabel from '../General/wtng-ttlabel.vue'
  const log = require("electron-log");
  export default {
    components: {
      statusDiv,
      WTNGttlabel
    },
    data() {
      return {
        PageName: "ET",
        exportLevels: [],
        optExpTypeMain: [
          {
            "text": i18n.t('Modules.ET.optExpType.MainMovie'),
            "value": et.ETmediaType.Movie
          },
          {
            "text": i18n.t('Modules.ET.optExpType.MainTV'),
            "value": et.ETmediaType.Show
          },
          {
            "text": i18n.t('Modules.ET.optExpType.MainAudio'),
            "value": et.ETmediaType.Artist
          },
          {
            "text": i18n.t('Modules.ET.optExpType.MainPhoto'),
            "value": et.ETmediaType.Photo,
            "disabled": true
          },
          {
            "text": i18n.t('Modules.ET.optExpType.MainPlaylist'),
            "value": et.ETmediaType.Playlist
          },
          {
            "text": i18n.t('Modules.ET.optExpType.MainLibrary'),
            "value": et.ETmediaType.Library
          }
        ],
        optExpTypeSec: [],
        selExpTypeMain: "",
        selExpTypeSec: "",
        selLevel: "",
        selLibrary: "",
        selLibraryOptions: [],
        selLibraryWait: true,
        selMediaType: "",
        selPType: "audio",
        pListGrpDisabled: true,
        etLibraryGroupDisabled: false,
        etLevelGroupDisabled: false,
     //   statusMsg: 'Idle',
        startEnd: i18n.t("Modules.ET.optExpType.startStopTitle"),
        startEndBody: i18n.t("Modules.ET.optExpType.startStopDesc"),
        startEndBody2: i18n.t("Modules.ET.optExpType.startStopDesc2"),
        startEndBody3: i18n.t("Modules.ET.optExpType.startStopDesc3"),
        startEndBody4: i18n.t("Modules.ET.optExpType.startStopDesc4"),
        startEndBtn: i18n.t("Modules.ET.optExpType.lblBtnExportMedia"),
        itemStartNo: etHelper.Settings.currentItem,
        itemEndNo: 0,
        sectionMaxItems: 0
      };
  },
  watch: {
    /*
    // Watch for status update
    ETStatus: function() {
      this.statusMsg = this.$store.getters.getETStatus;
    },
 */

    // Watch for when selected server address is updated
    selectedServerAddress: async function(){
      // Changed, so we need to update the libraries
      this.selLibraryWait = true;
      this.selLibrary = '';
      this.selLevel = "";
      this.selMediaType = "";
      this.selExpTypeMain = "";
      this.selExpTypeSec = "";
      this.btnDisable=!(this.selLibrary!=='Loading...' && this.selLevel!=='');
      await this.getPMSSections();
      this.selLibraryWait = true;
    },
    selMediaType: async function(){
      this.selLevel = "";
      this.selLibrary = "";
    },
    selectedServerAddressUpdateInProgress: async function(){
      this.selLibraryWait = false;
    },
  },
  created() {
    log.info("ET Created");
    this.serverSelected();
  },
  computed: {
    ETStatus: function(){
      return this.$store.getters.getETStatus;
    },
    btnDisable: function(){
      if (this.selLevel !== "" && this.selLibrary!=='')
      {
        return false;
      }
      else if ( this.selExpTypeSec == et.ETmediaType.Libraries)
      {
        //this.$store.commit("UPDATE_EXPORTLEVEL", 'all');
        return false;
      }
      else if (this.selExpTypeSec == et.ETmediaType.Playlists)
      {
        //this.$store.commit("UPDATE_EXPORTLEVEL", 'all');
        return false;
      }
      else
      {
        return true;
      }
    },
    selectedServerAddress: function(){
      return this.$store.getters.getSelectedServerAddress
    },
    selectedServerAddressUpdateInProgress(){
      return this.$store.getters.getSelectedServerAddressUpdateInProgress
    },
  },
  methods: {
    // Show Settings
    showSettings(){
      this.$router.push({ name: 'exportsettings' })
    },
    setItemStartNo: async function(){
      // Update settings with new start value
      etHelper.Settings.startItem = this.itemStartNo;
    },
    setItemEndNo: async function(){
      // Update settings with new start value
      if (Number(this.sectionMaxItems) < Number(this.itemEndNo)){
        this.itemEndNo = this.sectionMaxItems
      }
      etHelper.Settings.endItem = this.itemEndNo;
    },
    showStartEnd: async function(){
      // Will ask for a starting item as well as an ending item, then export
      // Start by getting the maximum and min items
      etHelper.Settings.currentItem = 0;
      this.itemStartNo = 0;
      etHelper.Settings.baseURL = this.$store.getters.getSelectedServerAddress;
      etHelper.Settings.accessToken = this.$store.getters.getSelectedServerToken;
      etHelper.Settings.totalItems = await etHelper.getSectionSize();
      this.itemEndNo = etHelper.Settings.totalItems;
      etHelper.Settings.endItem = this.itemEndNo;
      this.sectionMaxItems = this.itemEndNo;
      this.$refs['startEnd'].show();
    },
    hideStartEnd: async function(){
    // Hide StartEnd modal
      this.$refs['startEnd'].hide();
    },
    async serverSelected() {
      etHelper.resetETHelper();
      let serverCheck = this.$store.getters.getSelectedServer;
      if (serverCheck == "none") {
        log.debug("serverCheck is none");
        this.$bvToast.toast(this.$t("Modules.PMS.ErrorNoServerSelectedMsg"), {
          title: this.$t("Modules.PMS.ErrorNoServerSelectedTitle"),
          autoHideDelay: 4000,
          solid: true,
          variant: 'primary',
          toaster: 'b-toaster-bottom-right'
        });
      }
    },
    // Get levels for the selected media type
    getLevels: async function(){
      log.verbose(`Getting levels for: ${this.selExpTypeSec}`);
      this.exportLevels = [];
      const etLevel = et.getLevels(this.selExpTypeSec);
      const etCustomLevel = et.getCustomLevels(this.selExpTypeSec);
      const options = []
      const item = {}
      let custLabel = {}
      custLabel['text']=this.$t('Modules.ET.Custom.CustomLevels');
      custLabel['disabled']=true;
      custLabel['value']='';
      options.push(custLabel);
      Object.keys(etCustomLevel).forEach(function(key) {
        let option = {}
        option['value'] = etCustomLevel[key];
        if (key === "No Level Yet") {
          option['text']=i18n.t('Modules.ET.NoLevelFound');
          option['disabled'] = true;
        }
        else { option['text'] = key; }
        options.push(option);
      });
      let buildinLabel = {}
      buildinLabel['text']=this.$t('Modules.ET.BuildInLevels');
      buildinLabel['disabled']=true;
      buildinLabel['value']='';
      options.push(buildinLabel);
      Object.keys(etLevel).forEach(function(key) {
        let option = {}
        option['value'] = etLevel[key];
        if (key === "No Level Yet") {
          option['text']=i18n.t('Modules.ET.NoLevelFound');
          option['disabled'] = true;
        }
        else { option['text'] = key; }
        if (wtconfig.get('Developer.showDevLevels'))
        {
          options.push(option);
        }
        else
        {
          if (!option['text'].startsWith('dev'))
          {
            options.push(option);
          }
        }
      });
      item['options']=options;
      this.exportLevels = options;
    },
    // Get libraries for selected type
    getLibs: async function(){
      log.verbose('Getting list of libraries');
      log.verbose(`Target is: ${this.selMediaType}`);
      this.selLibraryOptions = [];
      let reqType;
      switch(this.selMediaType) {
        case et.ETmediaType.Episode:
          reqType = et.ETmediaType.Show;
          break;
        case et.ETmediaType.Album:
          reqType = et.ETmediaType.Artist;
          break;
        case et.ETmediaType.Track:
          reqType = et.ETmediaType.Artist;
          break;
        case et.ETmediaType.Playlist:
          reqType = et.ETmediaType.Playlist;
          break;
        default:
          reqType = this.selMediaType
      }
      reqType = (et.RevETmediaType[reqType]).toString().toLowerCase();
      this.selLibrary = "";
      await this.$store.dispatch('fetchSections')
      const sections = await this.$store.getters.getPmsSections;
      if (Array.isArray(sections) && sections.length) {
        sections.forEach(req => {
          if (req.type == reqType) {
            if (reqType == 'playlist')
            {
              if (req.playlistType == (et.RevETmediaType[this.selExpTypeSec]).toString().toLowerCase())
              {
                log.debug(`pushing library: ${req.title} to results`);
                let item = [];
                item['text']=req.title;
                item['value']=req.key;
                this.selLibraryOptions.push(Object.assign({}, item));
              }
            }
            else
            {
              log.debug(`pushing library: ${req.title} to results`);
              let item = [];
              item['text']=req.title;
              item['value']=req.key;
              this.selLibraryOptions.push(Object.assign({}, item));
            }
          }
        });
      } else {
        log.error("No Library found");
        this.selLibraryOptions.push["No Library found"];
      }
      log.verbose(`Sections to select among are: ${JSON.stringify(this.selLibraryOptions)}`);
    },
    getText: async function search(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].value == nameKey) {
          return myArray[i].text;
        }
      }
    },
    selLevelChanged: async function(myarg){
      log.verbose(`Level to export selected as: ${this.selLevel}`);
      etHelper.resetETHelper();
      etHelper.Settings.Level = this.selLevel;
      etHelper.Settings.levelName = await this.getText(myarg, this.exportLevels);
    },
    selLibraryChanged: async function(myarg){
      etHelper.resetETHelper();
      log.verbose(`Library key to export selected as: ${this.selLibrary}`);
      etHelper.Settings.selLibKey = this.selLibrary;
      etHelper.Settings.LibName = await this.getText(myarg, this.selLibraryOptions);
    },
    selExpTypeSecChanged: async function(){
      // Triggers when exp type is changed
      log.verbose(`Secondary export type selected as: ${arguments[0]}`);
      etHelper.Settings.fileMinor = this.optExpTypeSec.filter(it => it.value === arguments[0])[0]['text'];
      etHelper.Settings.selType = arguments[0];
      etHelper.Settings.libTypeSec = arguments[0];
      // Set selMediaType to the type we want, and has to handle exceptions
      switch(arguments[0]) {
        // Set type for episodes to shows
        case et.ETmediaType.Episode:
          // TV Episodes Selected
          this.selMediaType = et.ETmediaType.Show
          break;
        // Set type for playlist audio to playlist
        case et.ETmediaType.Playlist_Audio:
          // TV Episodes Selected
          this.selMediaType = et.ETmediaType.Playlist
          break;
        // Set type for playlist audio to playlist
        case et.ETmediaType.Playlist_Video:
          // TV Episodes Selected
          this.selMediaType = et.ETmediaType.Playlist
          break;
        // Set type for playlist audio to playlist
        case et.ETmediaType.Playlist_Photo:
          // TV Episodes Selected
          this.selMediaType = et.ETmediaType.Playlist
          break;
        default:
          this.selMediaType = arguments[0]
          break;
      }
      log.verbose(`Export Sec type selected: ${arguments[0]}`);
      if ( arguments[0] == et.ETmediaType.Libraries)
      {
        log.info('Exporting library info');
      }
      else
      {
        this.getLibs();
        this.getLevels();
      }
    },
    selExpTypeMainChanged: async function(){
      this.optExpTypeSec = [];
      this.selLibrary = '';
      this.selLibraryOptions = [];
      this.exportLevels = [];
      this.selExpTypeMain = arguments[0];
      this.optExpTypeSec = et.selSecOption[arguments[0]];
      etHelper.Settings.fileMajor = this.optExpTypeMain.filter(it => it.value === arguments[0])[0]['text'];
      log.verbose(`Export Main type selected: ${arguments[0]}`);
    },
    getPMSSections: async function(){
      this.selLibrary = "";
      await this.$store.dispatch('fetchSections')
      const sections = await this.$store.getters.getPmsSections;
      const result = [];
      // Alter target due to some exports share lib types
      switch(this.selMediaType) {
        case 'episode':
          this.selMediaType = 'show';
          break;
        case 'track':
          this.selMediaType = 'artist';
          break;
        case 'album':
          this.selMediaType = 'artist';
          break;
        default:
          log.error(`getPMSSections had an unknown selMediaType as: ${this.selMediaType}`);
      }

      const pListType = this.$store.getters.getSelectedPListType;
      if (Array.isArray(sections) && sections.length) {
        sections.forEach(req => {
          if (req.type == this.selMediaType) {
            if (this.selMediaType == 'playlist')
            {
              if (req.playlistType == pListType)
              {
                log.debug(`pushing library: ${req.title} to results`);
                let item = [];
                item['text']=req.title;
                item['value']=req.key;
                result.push(Object.assign({}, item));
              }
            }
            else
            {
              log.debug(`pushing library: ${req.title} to results`);
              let item = [];
              item['text']=req.title;
              item['value']=req.key;
              result.push(Object.assign({}, item));
            }
          }
        });
      } else {
        log.error("No Library found");
        result.push["No Library found"];
      }
      this.selLibraryOptions = result;
    },
    async getMedia() {
      log.info("getMedia Called");
      this.hideStartEnd();
      if (wtconfig.get('General.ExportPath', "") == "")
      {
        log.info('ET: No output dir defined')
        this.$bvToast.toast(this.$t("Common.ErrorNoOutDirMsg"), {
          title: this.$t("Common.ErrorNoOutDirTitle"),
          autoHideDelay: 3000,
          solid: true,
          variant: 'primary',
          toaster: 'b-toaster-bottom-right'
        })
        return
      }
      if ( !wtconfig.get("ET.ExpCSV"))
      {
        if ( !wtconfig.get("ET.ExpXLSX"))
        {
          log.error('ET: No output format defined')
          this.$bvToast.toast(this.$t("Modules.ET.ErrorNoOutputFormatMsg"), {
            title: this.$t("Modules.ET.ErrorNoOutputFormatTitle"),
            autoHideDelay: 3000,
            solid: true,
            variant: 'primary',
            toaster: 'b-toaster-bottom-right'
          })
          return
        }
      }
      status.clearStatus();
      status.updateStatusMsg( status.RevMsgType.Status, i18n.t("Common.Status.Msg.Processing"));
      // Populate et. settings with the selected values
      etHelper.Settings.libType = this.selMediaType;
      etHelper.Settings.Level = this.selLevel;
      etHelper.Settings.libTypeSec = this.selExpTypeSec;
      await etHelper.exportMedias();
    },
    async checkSrvSelected() {
      log.debug("checkSrvSelected started");
      let serverCheck = this.$store.getters.getSelectedServer;
      if (serverCheck == "none") {
        log.debug("serverCheck is none");
        this.$bvToast.toast(this.$t("Modules.ET.ErrorNoServerSelectedMsg"), {
          title: this.$t("Modules.ET.ErrorNoServerSelectedTitle"),
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
