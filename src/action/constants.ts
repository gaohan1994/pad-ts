export const CHANGE_STATUS_SHOW = 'CHANGE_STATUS_SHOW';
export type CHANGE_STATUS_SHOW = typeof CHANGE_STATUS_SHOW;

export const CHANGE_DOCUMENT_TITLE = 'CHANGE_DOCUMENT_TITLE';
export type CHANGE_DOCUMENT_TITLE = typeof CHANGE_DOCUMENT_TITLE;

/**
 * @param { business 不与数据库交互的业务逻辑 }
 * @param { SAVE_CHOICE_TABLEINFO 保存用户选择的桌号 }
 * @param { RECEIVE_STORE_LISTVIEW_DATASOURCE 保存listview需要的数据存到menu redux 中 }
 */
export const SAVE_CHOICE_TABLEINFO = 'SAVE_CHOICE_TABLEINFO';
export type SAVE_CHOICE_TABLEINFO = typeof SAVE_CHOICE_TABLEINFO;

export const SAVE_CHOICE_PEOPLE = 'SAVE_CHOICE_PEOPLE';
export type SAVE_CHOICE_PEOPLE = typeof SAVE_CHOICE_PEOPLE;

export const RECEIVE_STORE_LISTVIEW_DATASOURCE = 'RECEIVE_STORE_LISTVIEW_DATASOURCE';
export type RECEIVE_STORE_LISTVIEW_DATASOURCE = typeof RECEIVE_STORE_LISTVIEW_DATASOURCE;

export const SET_SELECTED_MENUTPID = 'SET_SELECTED_MENUTPID';
export type SET_SELECTED_MENUTPID = typeof SET_SELECTED_MENUTPID;

/**
 * @todo sign module
 */

export const CHANGE_SIGN_LOADING = 'CHANGE_SIGN_LOADING';
export type CHANGE_SIGN_LOADING = typeof CHANGE_SIGN_LOADING;

export const RECEIVE_USERINFO = 'RECEIVE_USERINFO';
export type RECEIVE_USERINFO = typeof RECEIVE_USERINFO;

/** 
 * @todo menu module
 */

export const RECEIVE_MENU_TP = 'RECEIVE_MENU_TP';
export type RECEIVE_MENU_TP = typeof RECEIVE_MENU_TP;

export const RECEIVE_ALL_MENU = 'RECEIVE_ALL_MENU';
export type RECEIVE_ALL_MENU = typeof RECEIVE_ALL_MENU;

/**
 * @todo order module
 * @param { RECEIVE_ORDER_LIST } 收到order列表
 * @param { RECEIVE_ORDER_DETAIL } 收到order详情
 * @param { CHANGE_ORDER_TOKEN } 是否显示修改中订单的状态
 * @param { CHANGE_ORDER_DETAIL } 修改订单 （退菜 修改人数 等等）
 * @param { CHANGE_ORDER_DETAIL -- CHANGE_ORDER_DISHES -- 修改订单的 changeType } 
 * @param { CHANGE_ORDER_DETAIL -- CHANGE_ORDER_PEOPLE_NUMBER -- 修改订单的 changeType } 
 * @param { CHANGE_ORDER_DETAIL -- CHANGE_ORDER_TABLE_NUMBER -- 修改订单的 changeType }
 */
export const RECEIVE_ORDER_LIST = 'RECEIVE_ORDER_LIST';
export type RECEIVE_ORDER_LIST = typeof RECEIVE_ORDER_LIST;

export const RECEIVE_ORDER_DETAIL = 'RECEIVE_ORDER_DETAIL';
export type RECEIVE_ORDER_DETAIL = typeof RECEIVE_ORDER_DETAIL;

export const CHANGE_ORDER_TOKEN = 'CHANGE_ORDER_TOKEN'; 
export type CHANGE_ORDER_TOKEN = typeof CHANGE_ORDER_TOKEN;

export const CHANGE_ORDER_DETAIL = 'CHANGE_ORDER_DETAIL'; 
export type CHANGE_ORDER_DETAIL = typeof CHANGE_ORDER_DETAIL;

export const CHANGE_ORDER_DISHES = 'CHANGE_DISHES';
export type CHANGE_ORDER_DISHES = typeof CHANGE_ORDER_DISHES;

export const CHANGE_ORDER_PEOPLE_NUMBER = 'CHANGE_PEOPLE_NUMBER';
export type CHANGE_ORDER_PEOPLE_NUMBER = typeof CHANGE_ORDER_PEOPLE_NUMBER;

export const CHANGE_ORDER_TABLE_NUMBER = 'CHANGE_ORDER_TABLE_NUMBER';
export type CHANGE_ORDER_TABLE_NUMBER = typeof CHANGE_ORDER_TABLE_NUMBER;

/**
 * @todo table modules
 */
export const RECEIVE_TABLE_INFO = 'RECEIVE_TABLE_INFO';
export type RECEIVE_TABLE_INFO = typeof RECEIVE_TABLE_INFO;

/**
 * @todo cart modules
 */

export const UPDATE_CART = 'UPDATE_CART';
export type UPDATE_CART = typeof UPDATE_CART;

export const ADD_NEW_ITEM = 'ADD_NEW_ITEM';
export type ADD_NEW_ITEM = typeof ADD_NEW_ITEM;

export const ADD_ITEM = 'ADD_ITEM';
export type ADD_ITEM = typeof ADD_ITEM;

export const REDUCE_ITEM = 'REDUCE_ITEM';
export type REDUCE_ITEM = typeof REDUCE_ITEM;

export const DELETE_ITEM = 'DELETE_ITEM';
export type DELETE_ITEM = typeof DELETE_ITEM;