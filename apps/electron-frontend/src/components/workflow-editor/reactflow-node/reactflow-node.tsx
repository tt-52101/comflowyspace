import { memo } from 'react'
import { type NodeProps, Position, type HandleType, Handle, Node, useStore } from 'reactflow'
import { type Widget, Input, type NodeId, SDNode } from '@comflowy/common/comfui-interfaces';

import { getBackendUrl } from '@comflowy/common/config'
import { Button, Space } from 'antd';
import { InputContainer } from '../reactflow-input/reactflow-input-container';
import nodeStyles from "./reactflow-node.style.module.scss";
export const NODE_IDENTIFIER = 'sdNode'

interface ImagePreview {
  image: string
  index: number
}

interface Props {
  node: NodeProps<{
    widget: Widget;
    value: SDNode;
  }>
  progressBar?: number
  imagePreviews?: ImagePreview[]
  onPreviewImage: (idx: number) => void
  onDuplicateNode: (id: NodeId) => void
  onNodesDelete: (nodes: Node[]) => void
}

function NodeComponent({
  node,
  progressBar,
  imagePreviews,
  onPreviewImage,
  onDuplicateNode,
  onNodesDelete,
}: Props): JSX.Element {
  const params = []
  const inputs = []
  const widget = node.data.widget;
  if ((widget?.input?.required?.image?.[1] as any)?.image_upload === true) {
    widget.input.required.upload = ["IMAGEUPLOAD"];
  }
  for (const [property, input] of Object.entries(widget.input.required)) {
    if (Input.isParameterOrList(input)) {
      params.push({ property, input })
    } else {
      inputs.push(property)
    }
  }

  const isInProgress = progressBar !== undefined

  return (
    <div className={`${nodeStyles.reactFlowNode}  ${node.selected ? nodeStyles.reactFlowSelected : ""}`}>
      <div className="node-header">
        <h2 className="node-title">{widget.name}</h2>
        {isInProgress ? <div className="progress-bar bg-teal-800" style={{ width: `${progressBar * 100}%` }} /> : <></>}
        {node.selected ? (
          <div className="node-selected-actions">
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="node-main">
        <div className="node-slots">
          <div className="node-inputs">
            {inputs.map((k) => (
              <Slot key={k} id={k} label={k} type="target" position={Position.Left} />
            ))}
          </div>
          <div className="node-outputs">
            {widget.output.map((k) => (
              <Slot key={k} id={k} label={k} type="source" position={Position.Right} />
            ))}
          </div>
        </div>
        <div className="node-params">
          {params.map(({ property, input }) => (
            <InputContainer key={property} name={property} id={node.id} input={input} widget={widget}/>
          ))}
        </div>
        <div className="node-images-preview">
          {imagePreviews
            ?.map(({ image, index }) => (
              <div className="node-image-preview-container" key={image}>
                <img
                  className="node-preview-image"
                  src={getBackendUrl(`/view/${image}`)}
                  onClick={() => onPreviewImage(index)}
                />
              </div>
            ))
            .reverse()}
        </div>
      </div>
    </div>
  )
}

export default memo(NodeComponent)

interface SlotProps {
  id: string
  label: string
  type: HandleType
  position: Position
}

/**
 * https://reactflow.dev/examples/nodes/connection-limit
 * @param param0 
 * @returns 
 */
function Slot({ id, label, type, position }: SlotProps): JSX.Element {
  const color = Input.getInputColor([label.toUpperCase()] as any);
  const transform  = useStore((st => {
    return st.transform[2]
  }));
  return (
    <div className={position === Position.Right ? 'node-slot node-slot-right' : 'node-slot node-slot-left'}>
      <Handle id={id.toUpperCase()} type={type} position={position} className="node-slot-handle" style={{
        backgroundColor: color,
        transform: `scale(${Math.max(1, 1/transform)})`
      }}/>
      <div className="node-slot-name" style={{ marginBottom: 2 }}>
        {label.toUpperCase()}
      </div>
    </div>
  )
}


