/**
 * created by Ghan 9.3
 * 
 * react-router-4 在history处理上我认为有一定的缺陷
 * 
 * 故使用自己创建的 history 
 * 
 * ---- Usaga ----
 * 
 * import history from '../xx';
 * 
 * history.push('/your route');
 * 
 * ...other api
 * 
 * ---- over ---- 
 * 
 * length: number;
 * 
 * action: Action;
 * 
 * location: Location;
 * 
 * push(path: Path, state?: LocationState): void;
 * 
 * push(location: LocationDescriptorObject): void;
 * 
 * replace(path: Path, state?: LocationState): void;
 * 
 * replace(location: LocationDescriptorObject): void;
 * 
 * go(n: number): void;
 * 
 * goBack(): void;
 * 
 * goForward(): void;
 * 
 * block(prompt?: boolean | string | TransitionPromptHook): UnregisterCallback;
 * 
 * listen(listener: LocationListener): UnregisterCallback;
 * 
 * createHref(location: LocationDescriptorObject): Href;
 */

import createHistory from 'history/createBrowserHistory';

export default createHistory();