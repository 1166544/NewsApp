'use strict';

import React, {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ToolbarAndroid,
  Component
} from 'react-native';

let RefreshableListView = require("../../Components/RefreshableListView");  // 自定义滚动列表
let api                 = require("../../Network/api.js");                  // API

/**
 * 主页面，包含一个列表
 */
class Dashboard extends Component {

 /**
  * 构造器
  * @param props
  */
  constructor(props) {
      super(props);
      this.state = {
          topStoryIDs: null,
          lastIndex: 0
      }
  }

 /**
  * 页面构建
  * @returns {XML}
  */
  render(){
    return(
      <View style={styles.container}>
        <ToolbarAndroid style={styles.toolbar}
                        title={'TOP STORES'}
                        titleColor={'#FFFFFF'}/>
        <RefreshableListView renderRow={(row)=>this.renderListViewRow(row)}
                             onRefresh={(page, callback)=>this.listViewOnRefresh(page, callback)}
                             backgroundColor={'#ffffff'}
                             loadMoreText={'Load More...'}/>
      </View>
    );
  }

 /**
  * 行渲染视图
  * @param row
  * @returns {XML}
  */
  renderListViewRow(row) {
      return(
          <TouchableHighlight underlayColor={'#f3f3f2'}
                              onPress={()=>this.selectRow(row)}>
            <View style={styles.rowContainer}>
                <Text style={styles.rowCount}>
                    {row.count}
                </Text>
                <View style={styles.rowDetailsContainer}>
                    <Text style={styles.rowTitle}>
                        {row.title}
                    </Text>
                    <Text style={styles.rowDetailsLine}>
                        Posted by {row.by} | {row.score} Points | {row.descendants} Comments
                    </Text>
                    <View style={styles.separator}/>
                </View>
            </View>
          </TouchableHighlight>
      );
  }

 /**
  * 列表更新逻辑
  * @param page
  * @param callback
  */
  listViewOnRefresh(page, callback) {
      if (page != 1 && this.state.topStoryIDs){
          this.fetchStoriesUsingTopStoryIDs(this.state.topStoryIDs, this.state.lastIndex, 5, callback);
      }
      else {
        fetch(api.HN_TOP_STORIES_ENDPOINT)
        .then((response) => response.json())
        .then((topStoryIDs) => {
            this.fetchStoriesUsingTopStoryIDs(topStoryIDs, 0, 12, callback);
            this.setState({topStoryIDs: topStoryIDs});
        })
        .done();
      }
  }

 /**
  *  获取列表详细信息
  * @param topStoryIDs
  * @param startIndex
  * @param amountToAdd
  * @param callback
  */
  fetchStoriesUsingTopStoryIDs(topStoryIDs, startIndex, amountToAdd, callback){
      var rowsData = [];
      var endIndex = (startIndex + amountToAdd) < topStoryIDs.length ? (startIndex + amountToAdd) : topStoryIDs.length;
      function iterateAndFetch(){
          if (startIndex >= endIndex) {
              callback(rowsData);
              return;
          } else {
              fetch(api.HN_ITEM_ENDPOINT + topStoryIDs[startIndex] + ".json")
                  .then((response) => response.json())
                  .then((topStory) => {
                      topStory.count = startIndex + 1;
                      rowsData.push(topStory);
                      startIndex++;
                      iterateAndFetch();
                  })
                  .done();
          }
      }
      iterateAndFetch();
      this.setState({lastIndex: endIndex});
  }

   /**
    * 行选中处理,向子页面传递数据,并跳转
    * @param row
    */
    selectRow(row){
        this.props.navigator.push({
            id: 'Post',
            title: "TOP STORY #"+row.count,
            post: row
        });
        console.log(row);
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
    rowContainer:{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    rowCount: {
        fontSize: 20,
        textAlign: 'right',
        color: 'gray',
        margin: 10,
        marginLeft: 15,
        backgroundColor: '#dedede'
    },
    rowDetailsContainer: {
        flex: 1
    },
    rowTitle: {
        fontSize: 15,
        textAlign: 'left',
        marginTop: 10,
        marginBottom: 4,
        marginRight: 10,
        color: '#000000'
    },
    rowDetailsLine: {
        fontSize: 12,
        marginBottom: 10,
        color: 'gray'
    },
    separator: {
        height: 1,
        backgroundColor: '#CCCCCC'
    } 
});

module.exports = Dashboard