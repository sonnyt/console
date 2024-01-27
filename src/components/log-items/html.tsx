import { Collapsable, LogWrapper } from "./base";
import LogItem from "../log-item";
import StringLog from "./string";
import { NodeTypes } from "../../libs/constants";
import styles from "./html.module.css";

type HTMLTagProps = {
  elm: Element;
  scope: WeakMap<any, any>;
};

const HTMLTag = ({ elm, children }: React.PropsWithChildren<HTMLTagProps>) => {
  return (
    <>
      {"<"}
      {elm.tagName.toLowerCase()}
      {Array.from(elm.attributes).map((attr, index) => (
        <AttrNode key={`html_attr_${index}`} node={attr} isMinimized={false} />
      ))}
      {">"}
      {children}
      {`</${elm.tagName.toLowerCase()}>`}
    </>
  );
};

const MinimizedString = ({
  children,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => {
  return (
    <LogWrapper
      {...props}
      className={`${styles.is_minimized} ${props.className ?? ""}`}
    >
      {children}
    </LogWrapper>
  );
};

type DomTreeProps = {
  nodes: NodeListOf<ChildNode>;
  scope: WeakMap<any, any>;
};

const DomTree = ({
  nodes,
  scope,
  children,
}: React.PropsWithChildren<DomTreeProps>) => {
  return (
    <ul className={styles.dom_tree}>
      {Array.from(nodes).map((child, index) => (
        <li key={`html_doc-fragment_child_${index}`}>
          <LogItem scope={scope} isMinimized={false} logs={[child]} />
        </li>
      ))}
      {children}
    </ul>
  );
};

type DocumentNodeProps = {
  node: Document;
  scope: WeakMap<any, any>;
  isMinimized: boolean;
};

const DocumentNode = ({ node, scope, isMinimized }: DocumentNodeProps) => {
  const href = node.location?.href ?? "about:blank";

  if (isMinimized) {
    return (
      <MinimizedString>
        <span>document</span>
      </MinimizedString>
    );
  }

  return (
    <Collapsable className={`${styles.log} ${styles.is_html}`}>
      <>
        <StringLog className="" log={`#document (${href})`} />
      </>
      <>
        <DomTree nodes={node.childNodes} scope={scope} />
      </>
    </Collapsable>
  );
};

type DocumentFragmentNodeProps = {
  node: DocumentFragment;
  scope: WeakMap<any, any>;
  isMinimized: boolean;
};

const DocumentFragmentNode = ({
  node,
  scope,
  isMinimized,
}: DocumentFragmentNodeProps) => {
  if (isMinimized) {
    return (
      <MinimizedString>
        <span>document-fragment</span>
      </MinimizedString>
    );
  }

  return (
    <Collapsable className={`${styles.log} ${styles.is_html}`}>
      <>
        <StringLog className="" log="#document-fragment" />
      </>
      <>
        <DomTree nodes={node.childNodes} scope={scope} />
      </>
    </Collapsable>
  );
};

type TextNodeProps = {
  node: Text;
  isMinimized: boolean;
};

const TextNode = ({ node, isMinimized }: TextNodeProps) => {
  if (isMinimized) {
    return (
      <MinimizedString>
        <span>text</span>
      </MinimizedString>
    );
  }

  return (
    <StringLog
      className={`${styles.is_html} ${styles.is_text}`}
      log={`"${node.wholeText}"`}
    />
  );
};

type AttrNodeProps = {
  node: Attr;
  isMinimized: boolean;
};

const AttrNode = ({ node, isMinimized }: AttrNodeProps) => {
  if (isMinimized) {
    return (
      <MinimizedString>
        <span></span>
        <span></span>
        <span>{node.name}</span>
      </MinimizedString>
    );
  }

  return (
    <LogWrapper className={`${styles.is_html} ${styles.is_attribute}`}>
      <span>{node.name}</span>="<span>{node.value}</span>"
    </LogWrapper>
  );
};

type CommentNodeProps = {
  node: Comment;
  isMinimized: boolean;
};

const CommentNode = ({ node, isMinimized }: CommentNodeProps) => {
  if (isMinimized) {
    return (
      <MinimizedString>
        <span>comment</span>
      </MinimizedString>
    );
  }

  return (
    <StringLog
      className={`${styles.is_html} ${styles.is_comment}`}
      log={`<!--${node.data}-->`}
    />
  );
};

type ProcessingInstructionNodeProps = {
  node: ProcessingInstruction;
  isMinimized: boolean;
};

const ProcessingInstructionNode = ({
  node,
  isMinimized,
}: ProcessingInstructionNodeProps) => {
  if (isMinimized) {
    return (
      <MinimizedString>
        <span>{node.target}</span>
      </MinimizedString>
    );
  }

  return <StringLog className={styles.is_html} log={node.target} />;
};

type ElementNodeProps = {
  node: Element;
  scope: WeakMap<any, any>;
  isMinimized: boolean;
};

const ElementNode = ({ node, scope, isMinimized }: ElementNodeProps) => {
  if (isMinimized) {
    const tagName = node.tagName.toLowerCase();
    const classNames = node.classList.value.replaceAll(" ", ".");

    return (
      <MinimizedString>
        <>
          <span>{tagName}</span>
          <span>{node.id && `#${node.id}`}</span>
          <span>{node.classList.length > 0 && `.${classNames}`}</span>
        </>
      </MinimizedString>
    );
  }

  if (node.childNodes.length === 0) {
    return (
      <LogWrapper className={`${styles.is_html} ${styles.is_element}`}>
        <HTMLTag elm={node} scope={scope} />
      </LogWrapper>
    );
  }

  return (
    <Collapsable
      className={`${styles.is_html} ${styles.is_element}`}
      toggle={true}
    >
      <>
        <HTMLTag elm={node} scope={scope}>
          {"{…}"}
        </HTMLTag>
      </>
      <>
        {"<"}
        {node.tagName.toLowerCase()}
        {Array.from(node.attributes).map((attr, index) => (
          <AttrNode
            key={`html_attr_${index}`}
            node={attr}
            isMinimized={false}
          />
        ))}
        {">"}
        <DomTree nodes={node.childNodes} scope={scope}>
          <li className={styles.close_tag}>
            {`</${node.tagName.toLowerCase()}>`}
          </li>
        </DomTree>
      </>
    </Collapsable>
  );
};

type HTMLLogProps = {
  log:
    | Element
    | Attr
    | Text
    | Comment
    | ProcessingInstruction
    | Document
    | DocumentFragment;
  scope: WeakMap<any, any>;
  isMinimized: boolean;
};

export default function HTMLLog({ log, scope, isMinimized }: HTMLLogProps) {
  if (log.nodeType === NodeTypes.DOCUMENT_NODE) {
    return (
      <DocumentNode
        node={log as Document}
        scope={scope}
        isMinimized={isMinimized}
      />
    );
  }

  const node = log.cloneNode(true);

  if (log.nodeType === NodeTypes.DOCUMENT_FRAGMENT_NODE) {
    return (
      <DocumentFragmentNode
        node={node as DocumentFragment}
        scope={scope}
        isMinimized={isMinimized}
      />
    );
  }

  if (node.nodeType === NodeTypes.TEXT_NODE) {
    return <TextNode node={node as Text} isMinimized={isMinimized} />;
  }

  if (node.nodeType === NodeTypes.ATTRIBUTE_NODE) {
    return <AttrNode node={node as Attr} isMinimized={isMinimized} />;
  }

  if (node.nodeType === NodeTypes.COMMENT_NODE) {
    return <CommentNode node={node as Comment} isMinimized={isMinimized} />;
  }

  if (node.nodeType === NodeTypes.PROCESSING_INSTRUCTION_NODE) {
    return (
      <ProcessingInstructionNode
        node={node as ProcessingInstruction}
        isMinimized={isMinimized}
      />
    );
  }

  if (node.nodeType === NodeTypes.ELEMENT_NODE) {
    return (
      <ElementNode
        node={node as Element}
        scope={scope}
        isMinimized={isMinimized}
      />
    );
  }

  return null;
}
