"use strict";

import Vue from 'vue';
import axios from "axios";

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
	// baseURL: process.env.baseURL || process.env.apiUrl || ""
	// timeout: 60 * 1000, // Timeout
	// withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
	function (config) {
		// Do something before request is sent
		return config;
	},
	function (error) {
		// Do something with request error
		return Promise.reject(error);
	}
);

// Add a response interceptor
_axios.interceptors.response.use(
	function (response) {
		// Do something with response data
		return response.data;
	},
	function (error) {
		// Do something with response error

		//todo 当没有权限时 对错误进行拦截处理
		const forbiddenFn = () => {
			alert('未登录  没有权限')
		}

		//todo 当后台返回错误/失败信息时  进行拦截处理
		const exceptionFn = (msg) => {
			alert(msg)
		}

		//http错误状态码
		let errorStatus = error.response.status;

		//http 错误信息
		let errorMsg = error.response.message;

		//根据错误状态码进行处理
		switch (errorStatus) {
			case '401':
				forbiddenFn();
				break;
			default:
				exceptionFn(errorMsg);
				break;
		}

		return Promise.reject(error);
	}
);
let Plugin = {}
Plugin.install = function (Vue, options) {
	Vue.axios = _axios;
	window.axios = _axios;
	Object.defineProperties(Vue.prototype, {
		axios: {
			get() {
				return _axios;
			}
		},
		$axios: {
			get() {
				return _axios;
			}
		},
	});
};

Vue.use(Plugin)

export default Plugin;
