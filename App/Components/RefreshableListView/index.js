/*
 * Component Name: RefreshableListView
 * Author: Simar Singh (github/iSimar)
 * Description: This component is used to render a listview that can be
 *              pulled down to refresh
 * 
 * Dependencies:
 *  -> react-native-gifted-listview 0.0.7 (https://github.com/FaridSafi/react-native-gifted-listview)
 *
 * Properties:
 *  -> renderRow
 *      render function for rows or cells in the listview
 *  -> onRefresh
 *      used for filling the listview on ethier pull to refresh or pagination (load more),
 *      it is called with 2 arugments page number and callback. see react-native-gifted-listview docs.
 *  -> backgroundColor (optional)
 *      default = '#FFFFFF', background color of the listview
 *  -> loadMoreText (optional)
 *      default = '+', text used at the end of the listview - pagination
 *  -> renderHeader (optional)
 *      rendering not sticky header of the listview
 *  
 * Example:
 *  <RefreshableListView renderRow={(row)=>this.renderListViewRow(row)}
 *                       renderHeader={this.renderListViewHeader}
 *                       onRefresh={(page, callback)=>this.listViewOnRefresh(page, callback)}
 *                       backgroundColor={'#F6F6EF'}
 *                       loadMoreText={'Load More...'}/>
 *  
 */

import React, {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Platform,
    Component
} from 'react-native';

let GiftedListView = require('react-native-gifted-listview');
let _props;

class RefreshableListView extends Component{
    constructor(props){
        super(props);
        //this.state = {
        //    renderRow: this.props.renderRow,
        //    backgroundColor: this.props.backgroundColor ? this.props.backgroundColor : '#FFFFFF',
        //    loadMoreText: this.props.loadMoreText ? this.props.loadMoreText : '+',
        //    renderHeader: this.props.renderHeader ? this.props.renderHeader : null
        //};
        _props = this.props;
    }

    /**
     * 注册更新逻辑
     * @param page
     * @param callback
     * @param options
     */
    onRefresh(page=1, callback, options){
        _props.onRefresh(page, callback);
    }

    /**
     * 渲染行逻辑
     * @param row
     * @returns {*}
     */
    renderRow(row){
        return _props.renderRow(row);
    }

    render(){
        return(
            <View style={[styles.container, {backgroundColor: _props.backgroundColor}, this.props.style]}>
                <View style={styles.navBarSpace} />
                <GiftedListView rowView={row => this.renderRow(row)}
                                onFetch={this.onRefresh.bind(this)}
                                paginationAllLoadedView={this.renderPaginationAllLoadedView.bind(this)}
                                paginationWaitingView={this.renderPaginationWaitingView.bind(this)}
                                headerView={this.renderHeaderView.bind(this)}
                                refreshable={Platform.OS !== 'android'}
                                customStyles={{
                                                refreshableView: {
                                                    backgroundColor: _props.backgroundColor,
                                                    justifyContent: 'flex-end',
                                                    paddingBottom: 12
                                                },
                                                paginationView: {
                                                    backgroundColor: _props.backgroundColor,
                                                    height: 60
                                                }
                                }}/>
            </View>
        );
    }

    renderPaginationAllLoadedView() {
        return(<View />);
    }

    renderPaginationWaitingView(paginateCallback) {
        return (
            <TouchableOpacity style={styles.paginationView}
                              onPress={paginateCallback}>
                <Text style={styles.loadMoreText}>
                    {_props.loadMoreText}
                </Text>
           </TouchableOpacity>
        );
    }

    renderHeaderView() {
        if(_props.renderHeader){
            return _props.renderHeader();
        }
        return (null);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    navBarSpace: {
        height: (Platform.OS !== 'android') ? 64 : 0
    },
    rowContainer: {
        paddingRight: 15,
        paddingLeft: 10,
        flexDirection: 'row'
    },
    paginationView: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20
    },
    loadMoreText: {
        fontSize: 15,
        color: 'gray'
    }
});

module.exports = RefreshableListView;