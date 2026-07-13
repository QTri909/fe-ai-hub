import React from 'react';

interface Mark {
  type: string;
  [key: string]: any;
}

interface ContentNode {
  type: string;
  content?: ContentNode[];
  text?: string;
  marks?: Mark[];
  attrs?: { [key: string]: any };
  [key: string]: any;
}

interface RequirementContentProps {
  content: any; // JSON format from Jira
}

export const RequirementContent: React.FC<RequirementContentProps> = ({ content }) => {
  if (!content || !content.content) {
    return null;
  }

  // Parse content based on format
  const parseSections = () => {
    const sections: { title: string; content: React.ReactNode }[] = [];

    content.content.forEach((node: ContentNode, idx: number) => {
      if (node.type === 'paragraph' && node.content) {
        const textContent = node.content
          .filter((c: ContentNode) => c.type === 'text')
          .map((c: ContentNode) => c.text || '')
          .join('');

        if (textContent.includes('USER STORY:')) {
          sections.push({
            title: 'User Story',
            content: (
              <p className="text-sm text-gray-300 leading-relaxed">
                {renderUserStory(node.content)}
              </p>
            )
          });
        } else if (textContent.includes('ACCEPTANCE CRITERIA:')) {
          sections.push({
            title: 'Acceptance Criteria',
            content: null
          });
        }
      } else if (node.type === 'bulletList') {
        sections.push({
          title: 'Acceptance Criteria',
          content: (
            <div className="space-y-3">
              {node.content?.map((child: ContentNode, childIdx: number) => (
                <div key={childIdx} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-500/20 text-indigo-300 rounded-full flex items-center justify-center text-xs font-semibold">
                    {childIdx + 1}
                  </span>
                  <p className="text-sm text-gray-300 flex-1">
                    🎯 {renderAcText(child.content?.[0])}
                  </p>
                </div>
              ))}
            </div>
          )
        });
      }
    });

    return sections;
  };

  // Render User Story with support for bold text
  const renderUserStory = (content: ContentNode[]) => {
    return content.map((c, i) => {
      if (c.type === 'text') {
        const text = c.text || '';
        if (c.marks?.some((m: Mark) => m.type === 'strong')) {
          return <strong key={i} className="text-white font-semibold">{text} </strong>;
        }
        return <span key={i}>{text}</span>;
      }
      return null;
    });
  };

  const renderAcText = (node: ContentNode | undefined) => {
    if (!node?.content) return null;
    return node.content.map((c, i) => {
      if (c.type === 'text') {
        const text = c.text || '';
        if (c.marks?.some((m: Mark) => m.type === 'strong')) {
          return <strong key={i} className="text-indigo-300">{text} </strong>;
        }
        return <span key={i}>{text} </span>;
      }
      return null;
    });
  };

  // Render sections that have been analyzed
  const sections = parseSections();

  return (
    <div className="space-y-4">
      {sections.map((section, idx) => (
        <React.Fragment key={idx}>
          {section.title === 'User Story' && (
            <div>
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">USER STORY:</h4>
              {section.content}
            </div>
          )}
          {section.title === 'Acceptance Criteria' && section.content && (
            <div>
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-3">ACCEPTANCE CRITERIA:</h4>
              {section.content}
            </div>
          )}
        </React.Fragment>
      ))}

      {/* Fallback: render all content if no recognized sections found */}
      {sections.length === 0 && (
        <div>
          {content.content?.map((node: ContentNode, idx: number) => {
            if (node.type === 'paragraph' && node.content) {
              return (
                <p key={idx} className="text-sm text-gray-300 leading-relaxed mb-2">
                  {renderUserStory(node.content)}
                </p>
              );
            }
            if (node.type === 'bulletList') {
              return (
                <ul key={idx} className="list-disc pl-5 space-y-2 mb-2">
                  {node.content?.map((child: ContentNode, childIdx: number) => (
                    <li key={childIdx} className="text-sm text-gray-300 leading-relaxed">
                      {renderAcText(child.content?.[0])}
                    </li>
                  ))}
                </ul>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};