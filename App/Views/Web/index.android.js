'use strict';

import React, {
    StyleSheet,
    Component,
    WebView
} from 'react-native';

/**
 * 显示网页内容
 */
class Web extends Component {

    constructor(props) {
        super(props);
        this.state = {
            url: 'http://www.baidu.com/',
            status: 'No Page Loaded',
            backButtonEnabled: false,
            forwardButtonEnabled: false,
            loading: true,
            scalesPageToFit: true
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <ToolbarAndroid style={styles.toolbar}
                                title={_routeData.title}
                                navIcon={{uri: "ic_arrow_back_white_24dp", isStatic: true}}
                                onIconClicked={this.props.navigator.pop}
                                titleColor={'#FFFFFF'}/>
                <WebView
                    ref={'webview'}
                    automaticallyAdjustContentInsets={false}
                    style={styles.webView}
                    url={this.state.url}
                    javaScriptEnabledAndroid={true}
                    onNavigationStateChange={this.onNavigationStateChange.bind(this)}
                    onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest.bind(this)}
                    startInLoadingState={true}
                    scalesPageToFit={this.state.scalesPageToFit}
                />
            </View>
        );
    }

    onShouldStartLoadWithRequest(event) {
        // Implement any custom loading logic here, don't forget to return!
        return true;
    }

    onNavigationStateChange(navState) {
        this.setState({
            backButtonEnabled: navState.canGoBack,
            forwardButtonEnabled: navState.canGoForward,
            url: navState.url,
            status: navState.title,
            loading: navState.loading,
            scalesPageToFit: true
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    toolbar: {
        height: 56,
        backgroundColor: '#4e9be3'
    },
    headerContainer: {
        flex: 1,
        backgroundColor: '#F6F6EF',
        flexDirection: 'column',
        paddingRight: 10,
        paddingLeft: 10
    },
    headerTitle: {
        fontSize: 20,
        textAlign: 'left',
        marginTop: 10,
        marginBottom: 10,
        color: '#000000'
    },
    webView: {
        backgroundColor: '#dedede',
        bottom: 0,
        right: 0,
        left: 0
    }
});

module.exports = Web;