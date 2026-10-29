// Võ Quốc An - ce190460
package fu.se.assignment02.service.impl;

import fu.se.assignment02.dto.TagDTO;
import fu.se.assignment02.entity.Tag;
import fu.se.assignment02.exception.BadRequestException;
import fu.se.assignment02.exception.ResourceNotFoundException;
import fu.se.assignment02.repository.TagRepository;
import fu.se.assignment02.service.TagService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;

    public TagServiceImpl(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    @Override
    public List<TagDTO> getAllTags() {
        return tagRepository.findAll().stream()
                .map(t -> new TagDTO(t.getTagID(), t.getTagName(), t.getNote()))
                .collect(Collectors.toList());
    }

    @Override
    public TagDTO getTagById(Integer id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found with ID: " + id));
        return new TagDTO(tag.getTagID(), tag.getTagName(), tag.getNote());
    }

    @Override
    public TagDTO createTag(TagDTO dto) {
        String name = dto.getName() != null ? dto.getName().trim() : "";
        if (tagRepository.existsByTagNameIgnoreCase(name)) {
            throw new BadRequestException("Tag \"" + name + "\" already exists.");
        }
        Tag tag = new Tag();
        tag.setTagName(name);
        tag.setNote(dto.getNote());
        Tag saved = tagRepository.save(tag);
        return new TagDTO(saved.getTagID(), saved.getTagName(), saved.getNote());
    }
}
