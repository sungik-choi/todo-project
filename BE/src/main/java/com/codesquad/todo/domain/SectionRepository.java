package com.codesquad.todo.domain;

import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface SectionRepository extends CrudRepository<Section, Long> {

  @Query("SELECT * FROM card c LEFT JOIN section s ON c.section = s.id WHERE c.id = :cardId AND s.id = :sectionId")
  Optional<Card> findCardBySectionIdAndCardId(Long sectionId, Long cardId);

  @Query("SELECT * FROM card WHERE card.id = :cardId")
  Optional<Card> findCardByCardId(Long cardId);

  @Modifying
  @Query("DELETE c FROM card c LEFT JOIN section s ON c.section = s.id WHERE c.id = :cardId AND s.id = :sectionId")
  void deleteCard(Long sectionId, Long cardId);

  @Modifying
  @Query("UPDATE card c " +
          "JOIN section s " +
          "ON c.section = s.id " +
          "SET c.title = :updatedTitle, c.contents = :updatedContents " +
          "WHERE c.id = :cardId AND s.id = :sectionId")
  void updateCard(Long sectionId, Long cardId, String updatedContents, String updatedTitle);
}
