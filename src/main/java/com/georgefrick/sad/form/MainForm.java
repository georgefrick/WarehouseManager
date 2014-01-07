package com.georgefrick.sad.form;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.apache.struts.action.ActionForm;

import com.georgefrick.fun.Client;
import com.georgefrick.fun.Part;

/**
 * @author gitter
 * 
 * This form holds the clients and parts used by the views.
 */
public class MainForm extends ActionForm {
	private static final long serialVersionUID = 1L;

	private List<Client> clients;
	private List<Part> parts;

	public List<Part> getParts() {
		return parts;
	}

	public void setParts(Collection<Part> parts) {
		this.parts = new ArrayList<Part>(parts);
	}

	public List<Client> getClients() {
		return clients;
	}

	public void setClients(Collection<Client> clients) {
		this.clients = new ArrayList<Client> (clients);
	}

	public static Client parseClient(Map<String, String[]> params) {
		Client client = new Client();
		
		client.setFirstName(params.get("firstName")[0]);
		client.setLastName(params.get("lastName")[0]);
		client.setPosition(params.get("position")[0]);
		client.setEmail(params.get("email")[0]);
		
		return client;
	}
	
	public static Part parsePart(Map<String, String[]> params) throws IOException {
		Part part = new Part();
		
		part.setName(params.get("name")[0]);
		part.setPartCode(params.get("partCode")[0]);
		part.setDescription(params.get("description")[0]);
		part.setStandard(params.get("standard")[0]);
		part.setQuantityPer(Integer.parseInt(params.get("quantityPer")[0]));
		part.setIsNonRefundable(params.get("isNonRefundable") != null && params.get("isNonRefundable")[0].equals("on"));
		
		return part;
	}
}
