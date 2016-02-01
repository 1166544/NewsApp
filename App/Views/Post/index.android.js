'use strict';

import React, {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    ToolbarAndroid,
    Component
} from 'react-native';

let RefreshableListView = require("../../Components/RefreshableListView");
let Comment             = require("./Elements/Comment");
let api                 = require("../../Network/api.js");

/**
 * 详细页面,包含展开回复功能
 */
class Post extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <ToolbarAndroid style={styles.toolbar}
                                title={this.props.route.title}
                                navIcon={{uri: "ic_arrow_back_white_24dp", isStatic: true}}
                                onIconClicked={this.props.navigator.pop}
                                titleColor={'#FFFFFF'}/>
                <RefreshableListView renderRow={(row)=>this.renderListViewRow(row)}
                                     renderHeader={this.renderListViewHeader.bind(this)}
                                     onRefresh={(page, callback)=>this.listViewOnRefresh(page, callback)}
                                     backgroundColor={'#F6F6EF'}
                                     loadMoreText={'Load More...'}/>
            </View>
        );
    }

    /**
     * 行渲染模板
     * @param row
     * @returns {XML}
     */
    renderListViewRow(row) {
        if (row.count == this.props.route.post.kids.length) {
            return (
                <View style={{paddingBottom: 20}}>
                    <Comment data={row}/>
                </View>
            );
        }
        return (
            <Comment data={row}/>
        );
    }

    /**
     * 行标题 渲染模板
     * @returns {XML}
     */
    renderListViewHeader() {
        return (
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>
                    {this.props.route.post.title}
                </Text>
                {this.renderPostText.bind(this)}
                {this.renderSourceButton.bind(this)}
                <Text style={styles.headerPostDetailsLine}>
                    Posted by {this.props.route.post.by} | {this.props.route.post.score} Points
                </Text>
                <View style={styles.separator}/>
                <Text style={styles.headerCommentTitle}>
                    {this.props.route.post.descendants} Comments:
                </Text>
            </View>
        );
    }

    /**
     * 回复区视图
     * @returns {*}
     */
    renderPostText() {
        if (!this.props.route.post.text) {
            return null;
        }
        return (
            <Text style={styles.headerPostText}>
                {this.fixPostText(this.props.route.post.text)}
            </Text>
        );
    }

    /**
     * 源代码按钮区视图
     * @returns {*}
     */
    renderSourceButton() {
        if (!this.props.route.post.url) {
            return null;
        }
        return (
            <TouchableHighlight onPress={() => this.pushSourceWebpage.bind(this)}
                                underlayColor='#F6F6EF'>
                <Text style={styles.headerSourceLabel}>
                    (View Source)
                </Text>
            </TouchableHighlight>
        );
    }

    /**
     * 列表更新逻辑
     * @param page
     * @param callback
     */
    listViewOnRefresh(page, callback) {
        if (this.props.route.post.kids == null) {
            this.props.route.post.kids = [];
        }
        if (this.props.route.post === null || this.props.route.post.kids.length === 0) {
            callback([], {allLoaded: true})
        }
        else if (page != 1) {
            this.fetchCommentsUsingKids(this.props.route.post.kids, this.state.lastIndex, 3, callback);
        }
        else {
            this.fetchCommentsUsingKids(this.props.route.post.kids, 0, 3, callback);
        }
    }

    /**
     * 拉取回复列表数据
     * @param kids
     * @param startIndex
     * @param amountToAdd
     * @param callback
     */
    fetchCommentsUsingKids(kids, startIndex, amountToAdd, callback) {
        var rowsData = [];
        var endIndex = (startIndex + amountToAdd) < kids.length ? (startIndex + amountToAdd) : kids.length;

        function iterateAndFetch() {
            if (startIndex < endIndex) {
                fetch(api.HN_ITEM_ENDPOINT + kids[startIndex] + ".json")
                    .then((response) => response.json())
                    .then((item) => {
                        item.count = startIndex + 1;
                        if (!item.deleted) {
                            rowsData.push(item);
                        }
                        startIndex++;
                        iterateAndFetch();
                    })
                    .done();
            }
            else {
                callback(rowsData, {allLoaded: endIndex == kids.length});
                return;
            }
        }

        iterateAndFetch();
        this.setState({lastIndex: endIndex});
    }

    /**
     * 跳转至WEB视图,显示一个网页
     */
    pushSourceWebpage() {
        this.props.navigator.push({
            id: 'Web',
            title: this.props.route.post.title,
            url: this.props.route.post.url
        });
    }

    /**
     * 过滤字符
     * @param str
     * @returns {string}
     */
    fixPostText(str) {
        return String(str).replace(/<p>/g, '\n\n')
            .replace(/&#x2F;/g, '/')
            .replace('<i>', '')
            .replace('</i>', '')
            .replace(/&#x27;/g, '\'')
            .replace(/&quot;/g, '\"')
            .replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)" rel="nofollow">(.*)?<\/a>/g, "$1");
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
    headerPostText: {
        fontSize: 14,
        marginBottom: 3
    },
    headerSourceLabel: {
        fontSize: 15,
        textAlign: 'left',
        color: '#0089FF',
        paddingBottom: 10
    },
    headerPostDetailsLine: {
        fontSize: 12,
        marginBottom: 10,
        color: 'gray'
    },
    separator: {
        height: 1,
        backgroundColor: '#CCCCCC'
    },
    headerCommentTitle: {
        color: 'gray',
        marginTop: 10
    }
});

module.exports = Post;