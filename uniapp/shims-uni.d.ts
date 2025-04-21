/// <reference types='@dcloudio/types' />
import "vue";

declare module "@vue/runtime-core" {
  // TODO: 
  type Hooks = App.AppInstance & Page.PageInstance;

  interface ComponentCustomOptions extends Hooks { }
}
