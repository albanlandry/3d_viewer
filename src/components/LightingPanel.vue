<style scoped>
    .container {
        max-width: 250px;
    }
</style>

<template>
    <!--
    <v-row>
        <v-col>
            <v-btn class="my-1" small tile outlined color="primary">
                <v-icon left>mdi-plus</v-icon> Add Light
            </v-btn>
        </v-col>
    </v-row>
    -->
    <v-row>
        <v-col cols="5">
            <v-menu
            v-model="menuBtn"
            :close-on-content-click="false"
            offset-x
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-btn dark
                        v-bind="attrs"
                        v-on="on"
                        class="my-1" small tile outlined color="primary">
                        <v-icon left>mdi-plus</v-icon> Add Light
                    </v-btn>
                </template>

                <v-container my-0 max-width="100px">
                    <v-row>
                        <v-col cols="12" class="text-center">
                            <v-btn @click="addLight(0)" cols="3" class="ma-2" small rounded outlined color="success">
                                <v-icon left>mdi-plus</v-icon> POINT LIGHT
                            </v-btn>
                            <v-btn @click="addLight(1)" cols="3" class="ma-2" small rounded outlined color="success">
                                <v-icon left>mdi-plus</v-icon> DIRECTIONAL LIGHT
                            </v-btn>
                            <v-btn @click="addLight(2)" cols="3" class="ma-2" small rounded outlined color="success">
                                <v-icon left>mdi-plus</v-icon> SPOTLIGHT
                            </v-btn>
                            <v-btn @click="addLight(3)"  cols="3" class="ma-2" small rounded outlined color="success">
                                <v-icon left>mdi-plus</v-icon> HEMISPHERE LIGHT
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-menu>
        </v-col>

        <v-row  v-if="enabled">
            <v-col cols="6" class="shrink" style="">
                <v-text-field v-model="color" label="Color" hide-details class="my-0 pa-0">
                    <template v-slot:append>
                        <v-menu
                        v-model="menuColor"
                        top
                        nudge-bottom="105"
                        nudge-left="16"
                        :close-on-content-click="false"
                        >
                        <template v-slot:activator="{ on }">
                            <div :style="swatchStyle" v-on="on" />
                        </template>
                        <v-card>
                            <v-card-text class="pa-0">
                                <v-color-picker @update:color="updateColor" v-model="params.color" flat />
                            </v-card-text>
                        </v-card>
                        </v-menu>
                    </template>
                </v-text-field>
            </v-col>
            <v-col cols="6" class="shrink" style="">
                <v-text-field
                    single-line
                    hide-details
                    class="my-0 pa-0"
                    label="Intensity"
                    type="number"
                    value="1"
                    step="0.01"
                    @change="updateIntensity"
                    v-model="params.intensity"
                ></v-text-field>
            </v-col>
        </v-row>
    </v-row>
</template>

<script>
  export default {
    data: () => ({
        fav: true,
        menuBtn: false,
        menuColor: false,
        message: false,
        hints: true,
        color: "#1976D2",
        // mask: "!#XXXXXXXX",
    }),

    computed: {
        swatchStyle() {
            return {
                backgroundColor: this.params.color,
                cursor: "pointer",
                height: "30px",
                width: "30px",
                borderRadius: this.menuColor ? "50%" : "4px",
                transition: "border-radius 200ms ease-in-out",
            };
        },

        // We enable only if it is a light from the dictionary variable
        // lightType in the store
        enabled(){
            const selected = this.$store.state.selected;
            if(selected){
                return this.$store.state.lightTypes[selected.constructor.name] != null;
            }

            return false;
        },

        params:{
            get: function(){
                const selected = this.$store.state.selected;

                if(this.enabled){
                    return {
                        color: `#${selected.color.getHexString()}`,
                        intensity: selected.intensity
                    };
                }

                return {};
            },

            set: function(params){
                console.log(params);
            }
        }
    },

    methods: {
        addLight(id){
            this.$root.$emit("add-light", id);
            this.menuBtn = false;
        },

        updateColor(color){
            this.color = this.params.color;
            this.$root.$emit("update-light-color", color);
        },

        updateIntensity(value){
            console.log("Value", value);
            this.$root.$emit("update-light-power", value);
        }
    },

    mounted(){
        this.color = this.params.color;
    }
  }
</script>