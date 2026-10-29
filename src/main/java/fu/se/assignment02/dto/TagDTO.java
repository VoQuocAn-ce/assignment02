// Võ Quốc An - ce190460
package fu.se.assignment02.dto;

public class TagDTO {

    private Integer id;
    private String name;
    private String note;

    public TagDTO() {
    }

    public TagDTO(Integer id, String name, String note) {
        this.id = id;
        this.name = name;
        this.note = note;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
