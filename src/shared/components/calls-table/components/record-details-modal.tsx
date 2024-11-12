import { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import {
  ACTIVITY_COLORS,
  ACTIVITY_STATUS,
  getChangeStatusDropdownItems,
  toScreamingSnakeCase,
} from '@shared/index';
import { CallsTableRecord } from '@store/index';
import { Button, Dropdown, Modal, Space, Tag, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

type Props = {
  data?: CallsTableRecord;
  open: boolean;
  currentStatus?: ACTIVITY_STATUS;
  onOk: () => void;
  onCancel: () => void;
  onStatusChange: (newStatus?: ACTIVITY_STATUS) => void;
};

export const RecordDetailsModal = ({
  data,
  open,
  currentStatus,
  onOk,
  onCancel,
  onStatusChange,
}: Props) => {
  const { t } = useTranslation();
  useEffect(() => {
    setCurrentStatusValue(currentStatus || '');
  }, [currentStatus]);

  const menuProps = {
    items: getChangeStatusDropdownItems(data?.status).map((item) => ({
      ...item,
      label: (
        <Tag
          color={ACTIVITY_COLORS[item.key]}
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
          {t(`ACTIVITY_STATUS.${item.label}`)}
        </Tag>
      ),
    })),
    onClick: ({ key }: { key: ACTIVITY_STATUS }) => setCurrentStatusValue(key),
  };

  const [currentStatusValue, setCurrentStatusValue] = useState<ACTIVITY_STATUS>('');

  return (
    <Modal
      zIndex={1}
      title={`${t('CALL')} №: ${data?.id}`}
      // @ts-ignore
      footer={null}
      open={open}
      onOk={onOk}
      onCancel={onCancel}>
      <div className="flex flex-col gap-2">
        <div>
          <div className="flex gap-1">
            <Text strong>{t('STATUS')}: </Text>
            {/* @ts-ignore */}
            <Dropdown menu={menuProps}>
              <a>
                <Space>
                  {t(`ACTIVITY_STATUS.${toScreamingSnakeCase(currentStatusValue)}`)}
                  <DownOutlined value={currentStatusValue} />
                </Space>
              </a>
            </Dropdown>
          </div>
          <Button
            disabled={currentStatusValue === data?.status}
            onClick={() => onStatusChange(currentStatusValue)}>
            {t('CHANGE_STATUS')}
          </Button>
        </div>
        {Object.entries<string>(data || {})
          .filter(([key]) => key !== 'id')
          .map(([key, value]) => {
            return (
              <div key={key} className="flex flex-col gap-1">
                {/* TODO: перевод key */}
                <Text strong>{key}: </Text>
                <Text>{value}</Text>
              </div>
            );
          })}
      </div>
    </Modal>
  );
};
