package com.georgefrick.fun;

/**
 * Represent a Part bean.
 * 
 * @author George Frick (george.frick@gmail.com)
 * 
 */
public class Part {

	Long id;
	String partCode;
	String name;
	String description;
	String standard;
	Integer quantityPer;
	Boolean isNonRefundable;
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

    public String getPartCode(){
        return this.partCode;
    }

    public void setPartCode(String partCode) {
        this.partCode = partCode;
    }

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getStandard() {
		return standard;
	}

	public void setStandard(String standard) {
		this.standard = standard;
	}

	public Integer getQuantityPer() {
	    return this.quantityPer;
	}

	public void setQuantityPer(Integer quantityPer) {
	    this.quantityPer = quantityPer;
	}

	public Boolean getIsNonRefundable() {
	    return this.isNonRefundable;
	}

	public void setIsNonRefundable(Boolean isNonRefundable) {
	    this.isNonRefundable = isNonRefundable;
	}
}
