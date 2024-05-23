import React, { useState, useEffect } from 'react';
import Grade, { GradeDocument, TopicDocument, SubtopicDocument, QuestionTypeDocument } from '../models/Grade';
import AddNew from './AddNew';
import styles from './GradeView.module.css';
import router from 'next/router';

const GradeView: React.FC = () => {
  const [grades, setGrades] = useState<GradeDocument[]>([]);
  const [expandedGrade, setExpandedGrade] = useState<string | null>(null);
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);
  const [expandedSubtopics, setExpandedSubtopics] = useState<string[]>([]);
  const [expandedQuestionTypes, setExpandedQuestionTypes] = useState<string[]>([]);
  const [showAddNew, setShowAddNew] = useState<{ level: string, parentId?: string } | null>(null);

  

  useEffect(() => {
    const fetchGrades = async () => {
      const response = await fetch('/api/grades');
      const data = await response.json();
      setGrades(data.gradeData);
    };

    fetchGrades();
  }, []);

  const toggleGrade = (gradeId: string) => {
    setExpandedGrade(expandedGrade === gradeId ? null : gradeId);
    setExpandedTopics([]);
    setExpandedSubtopics([]);
    setExpandedQuestionTypes([]);
  };

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(expandedTopics.includes(topicId)
      ? expandedTopics.filter((id) => id !== topicId)
      : [...expandedTopics, topicId]);
    setExpandedSubtopics([]);
    setExpandedQuestionTypes([]);
  };

  const toggleSubtopic = (subtopicId: string) => {
    setExpandedSubtopics(expandedSubtopics.includes(subtopicId)
      ? expandedSubtopics.filter((id) => id !== subtopicId)
      : [...expandedSubtopics, subtopicId]);
    setExpandedQuestionTypes([]);
  };

  const toggleQuestionType = (questionTypeId: string) => {
    setExpandedQuestionTypes(expandedQuestionTypes.includes(questionTypeId)
      ? expandedQuestionTypes.filter((id) => id !== questionTypeId)
      : [...expandedQuestionTypes, questionTypeId]);
  };

  const handleAddNew = async (name: string) => {
    if (showAddNew) {
      const { level, parentId } = showAddNew;
      let holder = "";

      try {
        let url = '';

        switch (level) {
          case 'Grade':
            url = '/api/grades';
            holder = "grade";
            break;
          case 'Topic':
            url = `/api/grades/${parentId}/topics`;
            holder = "topic";
            break;
          case 'Subtopic':
            url = `/api/grades/${grades.find((g) => g.topics.some((t) => t.topic === parentId))?.grade}/topics/${parentId}/subTopics`;
            holder = "subTopic";
            break;
          case 'QuestionType':
            const gradeHolder = grades.find((g) => g.topics.some((t) => t.subTopics.some((s) => s.subTopic === parentId)));
            const topicHolder = gradeHolder?.topics.find((t) => t.subTopics.some((s) => s.subTopic === parentId));
            url = `/api/grades/${gradeHolder?.grade}/topics/${topicHolder?.topic}/subTopics/${parentId}/questionTypes`;
            holder = "questionType";
            break;
        }

        console.log("HERE" + holder);

        const response = await fetch(url, { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ [holder]: name }),
        });

        if (response.ok) {
          router.reload();
        } else {
          console.error('Error adding new item:', await response.json());
        }
      } catch (error) {
        console.error('Error adding new item:', error);
      }

      setShowAddNew(null);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Grades</h2>
      <button
        className={styles.addButton}
        onClick={() => setShowAddNew({ level: 'Grade' })}
      >
        Add New Grade
      </button>
      <ul className={styles.list}>
        {grades.map((grade) => (
          <li key={grade._id} className={styles.item}>
            <div className={styles.header} onClick={() => toggleGrade(grade._id)}>
              {grade.grade}
            </div>
            {expandedGrade === grade._id && (
              <ul className={styles.subList}>
                <h3 className={styles.subHeading}>Topics</h3>
                <button
                  className={styles.addButton}
                  onClick={() => setShowAddNew({ level: 'Topic', parentId: grade.grade.toString() })}
                >
                  Add New Topic
                </button>
                {grade.topics && grade.topics.map((topic) => (
                  <li key={topic._id} className={styles.subItem}>
                    <div className={styles.subHeader} onClick={() => toggleTopic(topic._id)}>
                      {topic.topic}
                    </div>
                    {expandedTopics.includes(topic._id) && (
                      <ul className={styles.subSubList}>
                        <h4 className={styles.subSubHeading}>Subtopics</h4>
                        <button
                          className={styles.addButton}
                          onClick={() => setShowAddNew({ level: 'Subtopic', parentId: topic.topic })}
                        >
                          Add New Subtopic
                        </button>
                        {topic.subTopics && topic.subTopics.map((subTopic) => (
                          <li key={subTopic._id} className={styles.subSubItem}>
                            <div className={styles.subSubHeader} onClick={() => toggleSubtopic(subTopic._id)}>
                              {subTopic.subTopic}
                            </div>
                            {expandedSubtopics.includes(subTopic._id) && (
                              <ul className={styles.subSubSubList}>
                                <h5 className={styles.subSubSubHeading}>Question Types</h5>
                                <button
                                  className={styles.addButton}
                                  onClick={() => setShowAddNew({ level: 'QuestionType', parentId: subTopic.subTopic })}
                                >
                                  Add New Question Type
                                </button>
                                {subTopic.questionTypes && subTopic.questionTypes.map((questionType) => (
                                  <li key={questionType._id} className={styles.subSubSubItem}>
                                    <div className={styles.subSubSubHeader} onClick={() => toggleQuestionType(questionType._id)}>
                                      {questionType.questionType}
                                    </div>
                                    {expandedQuestionTypes.includes(questionType._id) && (
                                      <ul className={styles.questionList}>
                                        {questionType.problems && questionType.problems.map((problem) => (
                                          <li key={problem._id} className={styles.questionItem}>
                                            {problem.originalProblem}
                                            <button
                                              className={styles.addButton}
                                              onClick={() => console.log("Add new problem")}
                                            >
                                              Add New Problem
                                            </button>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      {showAddNew && (
        <AddNew
          level={showAddNew.level as 'Grade' | 'Topic' | 'Subtopic' | 'QuestionType'}
          parentId={showAddNew.parentId}
          onClose={() => setShowAddNew(null)}
          onAdd={handleAddNew}
        />
      )}
    </div>
  );
};

export default GradeView;