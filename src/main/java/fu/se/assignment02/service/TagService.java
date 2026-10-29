// Võ Quốc An - ce190460
package fu.se.assignment02.service;

import fu.se.assignment02.dto.TagDTO;

import java.util.List;

public interface TagService {
    List<TagDTO> getAllTags();
    TagDTO getTagById(Integer id);
    TagDTO createTag(TagDTO dto);
}
