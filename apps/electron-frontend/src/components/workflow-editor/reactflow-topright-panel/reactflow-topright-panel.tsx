import { PersistedWorkflowDocument } from "@comflowy/common/local-storage";
import { useAppStore } from "@comflowy/common/store";
import { getWorkflowTemplate } from "@comflowy/common/templates/templates";
import { Popconfirm, Space } from "antd";
import { useCallback } from "react";
import IconDown from "ui/icons/icon-down";

export default function ReactflowTopRightPanel() {
    const {onResetFromPersistedWorkflow, persistedWorkflow} = useAppStore();

    const resetDefault = useCallback(() => {
        onResetFromPersistedWorkflow(
            {
                ...getWorkflowTemplate("default"),
                id: persistedWorkflow.id,
                title: persistedWorkflow.title
            }
        )
    }, [onResetFromPersistedWorkflow, persistedWorkflow]);

    return (
        <div className="topLeftPanel">
            <Space>
                <Popconfirm
                    title="Reset workflow"
                    description="Are you sure to reset workflow to default?"
                    onConfirm={resetDefault}
                    onCancel={() => null}
                    okText="Yes"
                    cancelText="No"
                >
                    <div className="action action-reset">
                        Reset workflow
                    </div>
                </Popconfirm>
                <div className="action action-history">
                    Console
                </div>
                <div className="action action-queue">
                    Queue
                </div>
                <div className="action action-history">
                    History
                </div>
            </Space>
        </div>
    )
}