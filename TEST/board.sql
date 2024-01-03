CREATE TABLE `board`
(
    `id`         INT PRIMARY KEY AUTO_INCREMENT,
    `title`      VARCHAR(255)                       NOT NULL,
    `writer_id`  INT                                NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT `fk_board_writer_id` FOREIGN KEY (`writer_id`) REFERENCES `tb_user` (`id`)
);

CREATE TABLE `board_line`
(
    `id`           BIGINT PRIMARY KEY AUTO_INCREMENT,
    `board_id`     INT           NOT NULL,
    `idx`          INT           NOT NULL,
    `type`         VARCHAR(20)   NOT NULL,
    `attributes`   VARCHAR(1000) DEFAULT '{}',
    `text_content` VARCHAR(2000) NULL,
    `parent_id`    BIGINT        NULL
);

ALTER TABLE `board_line`
    ADD CONSTRAINT `fk_board_line_parent_id` FOREIGN KEY (`parent_id`) REFERENCES `board_line` (`id`);