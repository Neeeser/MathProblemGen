// /components/GradeView.tsx

import React, { useState, useEffect } from 'react';
import Grade, { GradeDocument, TopicDocument, SubtopicDocument, QuestionTypeDocument } from '../models/Grade';
import styles from './GradeView.module.css';

const GradeView: React.FC = () => {
  const [grades, setGrades] = useState<GradeDocument[]>([]);
  const [expandedGrade, setExpandedGrade] = useState<string | null>(null);
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);
  const [expandedSubtopics, setExpandedSubtopics] = useState<string[]>([]);
  const [expandedQuestionTypes, setExpandedQuestionTypes] = useState<string[]>([]);

  useEffect(() => {
    // Fetch grades from the API
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

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Grades</h2>
      <ul className={styles.list}>
        {grades.map((grade) => (
          <li key={grade._id} className={styles.item}>
            <div className={styles.header} onClick={() => toggleGrade(grade._id)}>
              <span className={styles.label}>Grade:</span> {grade.grade}
            </div>
            {expandedGrade === grade._id && (
              <ul className={styles.subList}>
                {grade.topics && grade.topics.map((topic) => (
                  <li key={topic._id} className={styles.subItem}>
                    <div className={styles.subHeader} onClick={() => toggleTopic(topic._id)}>
                      <span className={styles.label}>Topic:</span> {topic.topic}
                    </div>
                    {expandedTopics.includes(topic._id) && (
                      <ul className={styles.subSubList}>
                        {topic.subtopics && topic.subtopics.map((subtopic) => (
                          <li key={subtopic._id} className={styles.subSubItem}>
                            <div className={styles.subSubHeader} onClick={() => toggleSubtopic(subtopic._id)}>
                              <span className={styles.label}>Subtopic:</span> {subtopic.subtopic}
                            </div>
                            {expandedSubtopics.includes(subtopic._id) && (
                              <ul className={styles.subSubSubList}>
                                {subtopic.questionTypes && subtopic.questionTypes.map((questionType) => (
                                  <li key={questionType._id} className={styles.subSubSubItem}>
                                    <div className={styles.subSubSubHeader} onClick={() => toggleQuestionType(questionType._id)}>
                                      <span className={styles.label}>Question Type:</span> {questionType.questionType}
                                    </div>
                                    {expandedQuestionTypes.includes(questionType._id) && (
                                      <ul className={styles.questionList}>
                                        {questionType.problems && questionType.problems.map((problem) => (
                                          <li key={problem._id} className={styles.questionItem}>
                                            <span className={styles.label}>Question:</span> {problem.originalProblem}
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
    </div>
  );
};


export default GradeView;