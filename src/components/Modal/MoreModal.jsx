/** @jsx jsx */
import { jsx } from '@emotion/core';
import { connect } from 'react-redux';
import { Modal, ModalButtonItem, ModalItemGroup, ModalLinkItem } from '.';
import { URLMap } from '../../constants/urls';
import ViewType from '../../constants/viewType';
import { showConfirm } from '../../services/confirm/actions';
import { hideAllExpiredBooks } from '../../services/purchased/common/actions';
import { setViewType } from '../../services/ui/actions';

const MoreModal = ({
  order,
  orderOptions,
  isActive,
  query,
  onClickModalBackground,
  viewType,
  dispatchSetViewType,
  dispatchShowConfirm,
  dispatchHideAllExpiredBooks,
  showViewType,
  showOrder,
  showHidden,
}) => (
  <Modal isActive={isActive} a11y="옵션" onClickModalBackground={onClickModalBackground}>
    {showViewType ? (
      <ModalItemGroup groupTitle="보기 방식">
        <ul>
          <li>
            <ModalButtonItem
              title="표지만 보기"
              isSelected={viewType === ViewType.PORTRAIT}
              onClick={() => {
                onClickModalBackground();
                dispatchSetViewType(ViewType.PORTRAIT);
              }}
              replace
            />
          </li>
          <li>
            <ModalButtonItem
              title="목록 보기"
              isSelected={viewType === ViewType.LANDSCAPE}
              onClick={() => {
                onClickModalBackground();
                dispatchSetViewType(ViewType.LANDSCAPE);
              }}
              replace
            />
          </li>
        </ul>
      </ModalItemGroup>
    ) : null}
    {showOrder ? (
      <ModalItemGroup groupTitle="정렬 순서">
        <ul>
          {orderOptions.map(option => (
            <li key={option.key}>
              <ModalLinkItem
                title={option.title}
                isSelected={option.key === order}
                href={URLMap.main.href}
                as={URLMap.main.as}
                query={{
                  ...query,
                  orderType: option.orderType,
                  orderBy: option.orderBy,
                }}
                replace
              />
            </li>
          ))}
        </ul>
      </ModalItemGroup>
    ) : null}
    {showHidden ? (
      <ModalItemGroup groupTitle="숨김 메뉴">
        <ModalButtonItem
          title="만료 도서 전체 숨기기"
          onClick={() => {
            onClickModalBackground();
            dispatchShowConfirm(
              '만료 도서 전체 숨기기',
              <>구매목록에서 만료된 전체 도서를 숨기시겠습니까?</>,
              '숨기기',
              dispatchHideAllExpiredBooks,
            );
          }}
          replace
        />
        <ModalLinkItem title="숨긴 도서 목록" href={URLMap.hidden.href} as={URLMap.hidden.as} />
      </ModalItemGroup>
    ) : null}
  </Modal>
);

const mapStateToProps = state => ({
  viewType: state.ui.viewType,
});

const mapDispatchToProps = {
  dispatchSetViewType: setViewType,
  dispatchShowConfirm: showConfirm,
  dispatchHideAllExpiredBooks: hideAllExpiredBooks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MoreModal);
