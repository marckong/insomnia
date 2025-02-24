import { autoBindMethodsForReact } from 'class-autobind-decorator';
import { HotKeyRegistry } from 'insomnia-common';
import React, { Fragment, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { AUTOBIND_CFG } from '../../../common/constants';
import { GrpcRequest, isGrpcRequest } from '../../../models/grpc-request';
import { isRequest, Request } from '../../../models/request';
import type { RequestGroup } from '../../../models/request-group';
import { RootState } from '../../redux/modules';
import { selectActiveRequest, selectActiveWorkspace } from '../../redux/selectors';
import { SidebarCreateDropdown } from './sidebar-create-dropdown';
import { SidebarRequestGroupRow } from './sidebar-request-group-row';
import { SidebarRequestRow } from './sidebar-request-row';

export interface Child {
  doc: Request | GrpcRequest | RequestGroup;
  children: Child[];
  collapsed: boolean;
  hidden: boolean;
  pinned: boolean;
}
export interface SidebarChildObjects {
  pinned: Child[];
  all: Child[];
}

type ReduxProps = ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: RootState) => ({
  activeRequest: selectActiveRequest(state),
  workspace: selectActiveWorkspace(state),
});

interface Props extends ReduxProps {
  handleActivateRequest: Function;
  handleSetRequestPinned: Function;
  handleSetRequestGroupCollapsed: Function;
  handleDuplicateRequest: Function;
  handleDuplicateRequestGroup: (requestGroup: RequestGroup) => any;
  handleGenerateCode: Function;
  handleCopyAsCurl: Function;
  childObjects: SidebarChildObjects;
  filter: string;
  hotKeyRegistry: HotKeyRegistry;
}

@autoBindMethodsForReact(AUTOBIND_CFG)
class UnconnectedSidebarChildren extends PureComponent<Props> {
  _renderChildren(children: Child[], isInPinnedList: boolean) {
    const {
      filter,
      handleSetRequestPinned,
      handleSetRequestGroupCollapsed,
      handleDuplicateRequest,
      handleDuplicateRequestGroup,
      handleGenerateCode,
      handleCopyAsCurl,
      handleActivateRequest,
      activeRequest,
      hotKeyRegistry,
    } = this.props;
    const activeRequestId = activeRequest ? activeRequest._id : 'n/a';
    return children.map(child => {
      if (!isInPinnedList && child.hidden) {
        return null;
      }

      if (isRequest(child.doc) || isGrpcRequest(child.doc)) {
        return (
          <SidebarRequestRow
            key={child.doc._id}
            filter={isInPinnedList ? '' : filter || ''}
            handleActivateRequest={handleActivateRequest}
            handleSetRequestPinned={handleSetRequestPinned}
            handleDuplicateRequest={handleDuplicateRequest}
            handleGenerateCode={handleGenerateCode}
            handleCopyAsCurl={handleCopyAsCurl}
            isActive={child.doc._id === activeRequestId}
            isPinned={child.pinned}
            disableDragAndDrop={isInPinnedList}
            request={child.doc}
            hotKeyRegistry={hotKeyRegistry} // Necessary for plugin actions on requests
          />
        );
      }

      // We have a RequestGroup!
      const requestGroup = child.doc;

      function hasActiveChild(children: Child[]) {
        for (const c of children) {
          if (hasActiveChild(c.children || [])) {
            return true;
          } else if (c.doc._id === activeRequestId) {
            return true;
          }
        }

        // Didn't find anything, so return
        return false;
      }

      const isActive = hasActiveChild(child.children);

      const children = this._renderChildren(child.children, isInPinnedList);

      return (
        <SidebarRequestGroupRow
          key={requestGroup._id}
          filter={filter || ''}
          isActive={isActive}
          handleActivateRequest={handleActivateRequest}
          handleSetRequestGroupCollapsed={handleSetRequestGroupCollapsed}
          handleDuplicateRequestGroup={handleDuplicateRequestGroup}
          isCollapsed={child.collapsed}
          requestGroup={requestGroup}
          hotKeyRegistry={hotKeyRegistry}
        >
          {children}
        </SidebarRequestGroupRow>
      );
    });
  }

  _renderList(children: Child[], pinnedList: boolean) {
    return (
      <ul
        className="sidebar__list sidebar__list-root theme--sidebar__list"
      >
        {this._renderChildren(children, pinnedList)}
      </ul>
    );
  }

  render() {
    const { childObjects, hotKeyRegistry } = this.props;
    const showSeparator = childObjects.pinned.length > 0;
    const contextMenuPortal = ReactDOM.createPortal(
      <div className="hide">
        <SidebarCreateDropdown
          hotKeyRegistry={hotKeyRegistry}
        />
      </div>,
      document.querySelector('#dropdowns-container') as any,
    );
    return (
      <Fragment>
        {this._renderList(childObjects.pinned, true)}
        <div className={`sidebar__list-separator${showSeparator ? '' : '--invisible'}`} />
        {this._renderList(childObjects.all, false)}
        {contextMenuPortal}
      </Fragment>
    );
  }
}

export const SidebarChildren = connect(mapStateToProps)(UnconnectedSidebarChildren);
