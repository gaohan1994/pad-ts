declare module "*.css" {
  const content: any;
  export default content;
}

declare module "*.less" {
  const content: any;
  export default content;
}

/**
 * @param {md5} MD5 加密函数
 * @param {value} 要加密的string
 * @param {key} 不知道
 * @param {hash} 不知道
 */
declare function md5(value?: string): string;

declare function md5(value?: string, key?: string): string;

declare function md5(value?: string, key?: string, hash?: boolean): string;