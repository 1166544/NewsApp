'use strict';

import React, {
    AppRegistry,
    StyleSheet,
    Navigator,
    BackAndroid,
    Component
} from 'react-native';

let Dashboard   = require('./App/Views/Dashboard/index.android.js');
let Post        = require('./App/Views/Post/index.android.js');
let Web         = require('./App/Views/Web/index.android.js');
let _navigator;

/**
 * 回退按钮按下处理
 */
BackAndroid.addEventListener('hardwareBackPress', () => {
    if (_navigator.getCurrentRoutes().length === 1) {
        return false;
    }
    _navigator.pop();
    return true;
});

/**
 * 程序入口
 */
class HackerNews extends Component {

    render() {
        return (
            <Navigator
                style={styles.container}
                tintColor='#FF6600'
                initialRoute={{id: 'Dashboard'}}
                renderScene={this.navigatorRenderScene.bind(this)}/>
        );
    }

    /**
     * 导航跳转
     * @param route
     * @param navigator
     * @returns {XML}
     */
    navigatorRenderScene(route, navigator) {
        _navigator = navigator;
        switch (route.id) {
            case 'Dashboard':
                return (<Dashboard navigator={navigator} route={route}/>);
            case 'Post':
                return (<Post navigator={navigator} route={route}/>);
            case 'Web':
                return (<Web navigator={navigator} route={route}/>);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6EF'
    }
});

AppRegistry.registerComponent('HackerNews', () => HackerNews);